# Using This Corpus with Large Language Models

This guide covers practical strategies for loading the Socratic corpus into LLM context windows, building retrieval-augmented generation (RAG) pipelines, and crafting effective prompts for philosophical inquiry with Ancient Greek texts.

---

## Corpus Size and Token Estimates

The corpus consists of 33 texts totaling approximately 5.99 MB of UTF-8 encoded Ancient Greek in Markdown format.

### Size by Author

| Author | Texts | Total Size | Estimated Tokens |
|--------|-------|-----------|-----------------|
| Plato | 28 | ~4.78 MB | ~2.1M tokens |
| Xenophon | 4 | ~822 KB | ~370K tokens |
| Aristophanes | 1 | ~130 KB | ~58K tokens |
| **Total** | **33** | **~5.99 MB** | **~2.5M tokens** |

### Largest Individual Texts

| Text | Size | Estimated Tokens |
|------|------|-----------------|
| Republic | ~1.05 MB | ~460K |
| Memorabilia (Xenophon) | ~437 KB | ~190K |
| Gorgias | ~318 KB | ~140K |
| Timaeus | ~290 KB | ~127K |
| Theaetetus | ~273 KB | ~120K |
| Phaedo | ~263 KB | ~115K |

### Smallest Texts (suitable for single-context experiments)

| Text | Size | Estimated Tokens |
|------|------|-----------------|
| Clitophon | ~19 KB | ~8K |
| Ion | ~46 KB | ~20K |
| Crito | ~50 KB | ~22K |
| Hippias Minor | ~51 KB | ~22K |
| Xenophon's Apology | ~50 KB | ~22K |

**Note on Greek tokenization**: Ancient Greek text, written in polytonic Unicode, tokenizes at a significantly higher ratio than English. Where English typically runs 1 token per 4 characters, polytonic Greek text runs closer to 1 token per 2-2.5 characters with most current tokenizers. The estimates above use a conservative ratio. Actual token counts will vary by model and tokenizer.

---

## Strategy 1: Full Corpus in Context

### When to Use This

Use this approach when you need cross-textual analysis -- comparing treatments of a concept across multiple authors, tracing terminological evolution, or asking broad questions about the corpus as a whole.

### Model Requirements

Loading the full corpus (~2.5M tokens) requires a model with a context window of at least 2.5M tokens. As of early 2026, suitable options include:

| Model | Context Window | Notes |
|-------|---------------|-------|
| Claude (Opus, Sonnet) | 200K tokens | Can fit ~3-4 dialogues, or the full early period |
| Claude with extended context | 1M tokens | Can fit roughly 40% of the corpus |
| Gemini 1.5 Pro / 2.0 | 1-2M tokens | Can potentially fit the full corpus |
| GPT-4.1 | 1M tokens | Can fit roughly 40% of the corpus |

### Loading Strategies

**Concatenation.** The simplest approach: concatenate all text files and pass them as context. Use clear delimiters between texts:

```
=== PLATO: EUTHYPHRO ===
[contents of texts/plato/euthyphro/text.md]

=== PLATO: APOLOGY ===
[contents of texts/plato/apology/text.md]
...
```

**Selective loading.** For models with smaller context windows, load a thematically coherent subset. See `reading-order.md` for suggested groupings. Good subsets include:

- **Trial and death sequence**: Euthyphro + Apology + Crito + Phaedo (~225 KB, ~100K tokens)
- **Early aporetic dialogues**: Laches + Charmides + Euthyphro + Lysis + Hippias Minor + Ion (~240 KB, ~105K tokens)
- **Rhetoric group**: Gorgias + Protagoras + Euthydemus (~370 KB, ~160K tokens)
- **Cross-author comparison**: Plato's Apology + Xenophon's Apology + Memorabilia Book 1 (~200 KB, ~90K tokens)

**Priority loading.** If context is limited, prioritize the early dialogues. They are shorter, more self-contained, and more likely to represent the historical Socrates' actual views (see `socratic-problem.md`).

### Claude Context Caching

When using the Anthropic API with Claude, you can use prompt caching to avoid re-processing the corpus on every request. Load the corpus texts as a cached system prompt and then issue multiple user queries against the same cached context. This dramatically reduces latency and cost for multi-turn sessions.

```python
import anthropic

client = anthropic.Anthropic()

# Load corpus texts
corpus_text = ""
for path in corpus_file_paths:
    with open(path) as f:
        corpus_text += f"\n\n=== {path} ===\n\n" + f.read()

# First request creates the cache
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=4096,
    system=[
        {
            "type": "text",
            "text": f"You are a scholar of Ancient Greek philosophy. The following is the complete Socratic corpus in the original Greek:\n\n{corpus_text}",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[{"role": "user", "content": "your question here"}]
)
```

---

## Strategy 2: RAG / Vector Database

### When to Use This

Use RAG when you need to query the full corpus but your model's context window cannot hold all the texts, or when you want to build a persistent system that can answer questions about the corpus without reloading it each time.

### Chunking Strategies

Ancient Greek philosophical text has natural division points that should be respected when chunking:

1. **By Stephanus section** (recommended for Plato). The texts use Stephanus pagination headers (`### 17a`, `### 338c`, etc.) that divide the text into sections of roughly 100-500 words of Greek. These are the standard scholarly reference system and make excellent chunk boundaries.

2. **By section number** (for Xenophon and Aristophanes). These texts use numbered sections (`### 1`, `### 2`, etc.) that serve the same purpose.

3. **Fixed-size with overlap.** If you need uniform chunk sizes, use 500-1000 tokens per chunk with 100-token overlap. But always prefer splitting at section boundaries when possible to avoid cutting mid-sentence or mid-argument.

### Metadata for Chunks

Each chunk should carry metadata for filtering and attribution:

```json
{
  "author": "plato",
  "work": "republic",
  "section": "338c",
  "book": "1",
  "period": "middle",
  "themes": ["justice", "power", "thrasymachus"],
  "source_path": "texts/plato/republic/text.md"
}
```

### Embedding Models for Greek

Most embedding models are trained primarily on English and other modern languages. For Ancient Greek text, consider:

- **Multilingual models**: Models like `multilingual-e5-large` or `BGE-M3` have some polytonic Greek capability but will not capture fine philosophical distinctions.
- **Hybrid approach**: Store both the original Greek and, if available, a standard translation. Embed the translation for retrieval but return the Greek for analysis.
- **Character-aware models**: Greek diacritics (breathing marks, accents) carry linguistic information. Models that handle Unicode well will perform better than those that strip or normalize diacritics.

### Retrieval Tips

- **Query in both Greek and English.** If your user asks about "justice," also search for *dikaiosyne* (and its inflected forms) to catch passages that a multilingual model might miss.
- **Boost by section proximity.** Philosophical arguments span multiple Stephanus sections. When you retrieve one relevant section, consider also pulling the sections immediately before and after it.
- **Filter by author.** When the user asks about "Socrates' view on X," prompt them to specify whether they mean Plato's, Xenophon's, or Aristophanes' Socrates. Then filter accordingly.

---

## Strategy 3: Fine-Tuning and Specialized Models

Fine-tuning is generally not recommended for this corpus unless you have a specific downstream task (e.g., parsing Stephanus references, identifying speakers in dialogue, or classifying arguments by type). The corpus is too small for meaningful language model pre-training, and the texts are well-served by in-context approaches.

If you do fine-tune, good tasks include:

- **Speaker identification**: Given a passage from a dialogue, identify who is speaking
- **Section classification**: Tag Stephanus sections by topic, argument type, or philosophical method
- **Cross-reference generation**: Given a passage, identify thematically related passages in other dialogues

---

## Prompt Templates

### Basic Text Analysis

```
The following is an excerpt from Plato's [DIALOGUE NAME] in the original Ancient Greek,
from the Burnet OCT edition.

[PASTE GREEK TEXT]

Please analyze the argument Socrates makes in this passage. Identify:
1. The key philosophical terms in Greek and their meanings in this context
2. The logical structure of the argument
3. Any assumptions that Socrates' interlocutor is forced to accept
```

### Cross-Textual Comparison

```
Below are two passages on the topic of [TOPIC]. The first is from Plato's [DIALOGUE],
the second from Xenophon's [WORK].

Passage 1 (Plato):
[GREEK TEXT]

Passage 2 (Xenophon):
[GREEK TEXT]

Compare how each author's Socrates treats this topic. Note differences in vocabulary,
argumentative method, and philosophical conclusions. Where they disagree, explain what
each author's Socrates is committed to and why.
```

### Terminological Analysis

```
I am studying the term [GREEK TERM] across the Platonic corpus.

In the following passages, this term appears in different argumentative contexts.
For each passage, explain:
1. The grammatical form of the term as it appears
2. What it means in this specific context
3. How this usage compares to the other passages

[PASSAGES WITH STEPHANUS REFERENCES]
```

### Socratic Method Reconstruction

```
Based on the following passage from [DIALOGUE], reconstruct the elenctic argument
as a series of numbered steps:

[GREEK TEXT]

For each step, identify:
- The proposition agreed to
- Whether it was volunteered by the interlocutor or elicited by Socrates' questioning
- How it connects to the next step
- Where, if anywhere, the logic is questionable
```

### Historical Context

```
Read the following passage from Aristophanes' Clouds alongside the passage from
Plato's Apology where Socrates addresses the comic poets' influence on his reputation.

Clouds passage:
[GREEK TEXT]

Apology passage:
[GREEK TEXT]

What specific accusations from the Clouds does Socrates seem to be responding to
in the Apology? How does Plato's Socrates recharacterize what Aristophanes presented
as comedy?
```

---

## Common Pitfalls

### 1. Assuming the model reads Greek perfectly

Current LLMs have varying quality with Ancient Greek. They handle common vocabulary and syntax well but may struggle with rare forms, textual corruption, or highly compressed philosophical argument. Always verify specific claims about Greek grammar or vocabulary against a reference grammar or lexicon.

### 2. Ignoring the Socratic problem

See `socratic-problem.md`. A model that ingests the full corpus without guidance will conflate different authors' portrayals. Always specify which text and author you are asking about.

### 3. Treating dialogue as proposition

Plato's dialogues are dramatic works. Socrates sometimes uses irony, sometimes makes arguments he does not endorse to test an interlocutor, and sometimes speaks in myth or allegory. A model that extracts sentences as if they were straightforward assertions of belief will frequently get the philosophy wrong.

### 4. Overlooking the Greek

If you are loading this corpus into an LLM, you are working with the original language. Take advantage of it. Ask about specific Greek words, about grammatical structures, about how word choice shapes meaning. The purpose of a Greek-language corpus is to go beyond what translations offer.

### 5. Context window overflow

The Republic alone is roughly 460K tokens. If you load it alongside other texts and a detailed system prompt, you may exceed your context window without realizing it. Most APIs will silently truncate. Monitor token usage and be deliberate about what you include.

---

## Recommended Workflows

### For Scholars

1. Load a specific dialogue into context with a scholarly system prompt
2. Ask the model to identify the structure of arguments, key terminology, and cross-references
3. Use the model as a research assistant, not as an authority -- verify its claims against the Greek text and scholarly literature

### For Students

1. Load one of the shorter early dialogues (Euthyphro, Crito, Ion)
2. Ask the model to walk through the argument step by step
3. Ask it to explain unfamiliar Greek terms and grammatical constructions
4. Compare the model's reading with published translations and commentaries

### For Developers

1. See `for-developers.md` for technical integration details
2. Start with a RAG prototype using the trial-and-death sequence (4 texts, ~100K tokens)
3. Iterate on chunking strategy and metadata before scaling to the full corpus
