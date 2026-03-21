# socrates-source

> Everything we know about Socrates, in the original Greek,
> structured for humans and machines.

Socrates never wrote a word. Everything we know about him comes from a handful of people who wrote down what he said — or what they imagined he said. This repository collects **every surviving primary source text in which Socrates appears as a character or speaker**, in the **original Ancient Greek**, structured with rich metadata for exploration by both humans and large language models.

The entirety of Socrates fits in a single repository. This is that repository.

## Why Original Greek?

Because that's what was actually written. Every translation is an interpretation — of ambiguous words, philosophical concepts, tone, irony. By providing the source text, we let the reader (human or machine) make those interpretive choices consciously rather than inheriting them from a translator. A modern LLM can translate directly from Ancient Greek and discuss the translation choices it makes.

## What's Included

| Author | Works | Texts | Period |
|--------|-------|-------|--------|
| **Plato** | 28 dialogues | Euthyphro through Critias | c. 399–347 BCE |
| **Xenophon** | 4 Socratic works | Memorabilia, Apology, Symposium, Oeconomicus | c. 371–354 BCE |
| **Aristophanes** | 1 comedy | The Clouds | 423 BCE |

**33 texts total** — the complete primary source record of Socrates as a dramatic character.

### Scope Boundaries

**Included**: Every text where Socrates appears as a named character or direct speaker.

**Excluded**: Aristotle's scattered references (Socrates not a character), later doxographers (Diogenes Laërtius etc.), Plato's Laws (Socrates absent), modern translations, secondary scholarship.

## Quick Start

### I'm a developer

```bash
# Clone the repo
git clone https://github.com/topher416/socrates-source.git
cd socrates-source

# Export the entire corpus as a single file for an LLM context window
python scripts/export_single_file.py --include-metadata --output corpus_full.md

# Count tokens
python scripts/count_tokens.py

# Validate all metadata
python scripts/validate_metadata.py
```

See [guides/for-developers.md](guides/for-developers.md) for token counts, embedding strategies, and integration tips.

### I'm a student

Start with the **"last days" sequence** — four dialogues covering Socrates' trial and death:

1. [Euthyphro](texts/plato/euthyphro/) — Before the trial: What is piety?
2. [Apology](texts/plato/apology/) — The trial: Socrates defends himself
3. [Crito](texts/plato/crito/) — In prison: Should Socrates escape?
4. [Phaedo](texts/plato/phaedo/) — Execution day: Is the soul immortal?

Each text directory contains `text.md` (the Greek) and `metadata.json` (context, characters, themes, dating, famous passages). See [guides/reading-order.md](guides/reading-order.md) for three complete reading paths.

### I'm just curious

Browse the [metadata/](metadata/) directory:
- [characters.json](metadata/characters.json) — Every person who appears across all texts
- [themes.json](metadata/themes.json) — Philosophical topics with Greek terms
- [timeline.json](metadata/timeline.json) — When each conversation is set
- [cross-references.json](metadata/cross-references.json) — How the texts connect

Read [guides/socratic-problem.md](guides/socratic-problem.md) to understand why "what Socrates really said" is a harder question than it seems.

## How to Use With an LLM

Point a large language model at this corpus and it can translate, analyze, cross-reference, and discuss Socrates grounded entirely in what was actually written — not in training data noise.

```
Load the contents of socrates-source/texts/plato/apology/text.md
and socrates-source/texts/plato/apology/metadata.json into context.

Then: "Translate Apology 38a and explain why this passage matters."
```

The corpus is designed to fit within modern context windows. See [guides/llm-usage.md](guides/llm-usage.md) for detailed instructions, prompt templates, and RAG strategies.

## The Socratic Problem

We have three very different Socrateses:

- **Plato's Socrates** — a philosophical hero who develops increasingly ambitious metaphysical theories
- **Xenophon's Socrates** — a practical moral teacher focused on self-control and useful knowledge
- **Aristophanes' Socrates** — a ridiculous sophist who runs a "Thinkery" and studies clouds

Which one is the "real" Socrates? Probably none of them entirely. Read [guides/socratic-problem.md](guides/socratic-problem.md) for the full story.

## Repository Structure

```
socrates-source/
├── texts/
│   ├── plato/          # 28 dialogues
│   ├── xenophon/       # 4 Socratic works
│   └── aristophanes/   # The Clouds
├── metadata/           # Global indexes (characters, themes, timeline, cross-references)
├── guides/             # Reading orders, LLM usage, developer guide, Socratic problem
├── scripts/            # Build, validate, export, count tokens
├── corpus.json         # Master index of all texts
├── SOURCES.md          # Text provenance and editions
└── CONTRIBUTING.md     # How to contribute
```

## Source Texts

All Greek texts are from the **Perseus Digital Library** (Tufts University), based on the standard critical editions:

- **Plato**: Burnet's Oxford Classical Text (1903)
- **Xenophon**: Marchant's Oxford Classical Text
- **Aristophanes**: Hall & Geldart's Oxford Classical Text

See [SOURCES.md](SOURCES.md) for full provenance details.

## Contributing

Corrections to Greek text, metadata improvements, and script enhancements are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

CC BY-SA 4.0. The Greek source texts are derived from Perseus Digital Library (CC BY-SA 3.0).
