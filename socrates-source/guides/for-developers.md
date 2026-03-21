# Developer Guide

Technical reference for integrating the Socratic corpus into applications, pipelines, and conversational AI systems.

---

## Corpus Structure and File Format

Every text in the corpus follows the same Markdown structure:

```markdown
# [Greek Title]
## [English Title] -- [Author]

**Source: [Edition] | Perseus Digital Library**

---

[Greek text with Stephanus/section headers as ### headings]
```

The directory layout is flat and predictable:

```
texts/
  plato/
    apology/text.md
    crito/text.md
    republic/text.md
    ...  (28 dialogues)
  xenophon/
    memorabilia/text.md
    apology/text.md
    symposium/text.md
    oeconomicus/text.md
  aristophanes/
    clouds/text.md
```

All Greek text is Unicode NFC-normalized polytonic Greek. No transliteration, no Latin-alphabet substitutions.

---

## Token Counts and Size Reference

### Per-Text Sizes (sorted by size descending)

| Author | Text | Bytes | Est. Tokens |
|--------|------|-------|-------------|
| Plato | Republic | 1,047,423 | ~460K |
| Xenophon | Memorabilia | 436,729 | ~190K |
| Plato | Gorgias | 317,571 | ~140K |
| Plato | Timaeus | 290,005 | ~127K |
| Plato | Theaetetus | 273,161 | ~120K |
| Plato | Phaedo | 263,008 | ~115K |
| Xenophon | Oeconomicus | 222,208 | ~97K |
| Plato | Statesman | 218,392 | ~96K |
| Plato | Cratylus | 216,308 | ~95K |
| Plato | Philebus | 215,805 | ~95K |
| Plato | Protagoras | 211,296 | ~93K |
| Plato | Symposium | 207,356 | ~91K |
| Plato | Phaedrus | 202,133 | ~89K |
| Plato | Sophist | 198,592 | ~87K |
| Plato | Parmenides | 165,759 | ~73K |
| Plato | Euthydemus | 147,233 | ~65K |
| Aristophanes | Clouds | 130,233 | ~57K |
| Plato | Alcibiades I | 125,402 | ~55K |
| Plato | Meno | 117,216 | ~51K |
| Xenophon | Symposium | 113,825 | ~50K |
| Plato | Apology | 105,009 | ~46K |
| Plato | Hippias Major | 98,738 | ~43K |
| Plato | Charmides | 95,761 | ~42K |
| Plato | Laches | 91,749 | ~40K |
| Plato | Lysis | 79,853 | ~35K |
| Plato | Menexenus | 61,101 | ~27K |
| Plato | Critias | 61,046 | ~27K |
| Plato | Euthyphro | 60,214 | ~26K |
| Plato | Hippias Minor | 50,800 | ~22K |
| Xenophon | Apology | 50,044 | ~22K |
| Plato | Crito | 49,623 | ~22K |
| Plato | Ion | 46,231 | ~20K |
| Plato | Clitophon | 19,169 | ~8K |
| **Total** | | **5,988,993** | **~2.5M** |

Token estimates assume ~2.4 bytes per token for polytonic Greek. Actual counts depend on the tokenizer. To get exact counts for a specific model:

```python
import tiktoken

enc = tiktoken.encoding_for_model("gpt-4")
with open("texts/plato/republic/text.md") as f:
    tokens = enc.encode(f.read())
print(f"Republic: {len(tokens)} tokens")
```

For Claude's tokenizer, use the Anthropic SDK's token counting endpoint or estimate at ~2.4 bytes/token for Greek text.

---

## Parsing the Texts

### Extracting Sections

Every text uses `###` headers for section divisions. For Plato, these are Stephanus page-and-letter references (e.g., `### 338c`). For Xenophon and Aristophanes, they are numbered sections (e.g., `### 1`, `### 42`).

```python
import re
from pathlib import Path

def parse_sections(filepath: str) -> list[dict]:
    """Parse a corpus text file into sections."""
    text = Path(filepath).read_text(encoding="utf-8")

    # Extract metadata from header
    lines = text.split("\n")
    greek_title = lines[0].lstrip("# ").strip()
    subtitle = lines[1].lstrip("# ").strip()

    # Split on section headers
    sections = []
    parts = re.split(r"^### (.+)$", text, flags=re.MULTILINE)

    # parts[0] is the header, then alternating: section_id, section_text
    for i in range(1, len(parts), 2):
        section_id = parts[i].strip()
        section_text = parts[i + 1].strip() if i + 1 < len(parts) else ""
        if section_text:
            sections.append({
                "section": section_id,
                "text": section_text,
                "greek_title": greek_title,
            })

    return sections
```

### Building a Full Index

```python
from pathlib import Path

TEXTS_DIR = Path("texts")

def build_corpus_index() -> list[dict]:
    """Build a flat index of all sections across all texts."""
    index = []

    for author_dir in sorted(TEXTS_DIR.iterdir()):
        if not author_dir.is_dir():
            continue
        author = author_dir.name

        for work_dir in sorted(author_dir.iterdir()):
            if not work_dir.is_dir():
                continue
            work = work_dir.name
            filepath = work_dir / "text.md"

            if not filepath.exists():
                continue

            sections = parse_sections(str(filepath))
            for section in sections:
                section["author"] = author
                section["work"] = work
                section["path"] = str(filepath)
                index.append(section)

    return index
```

### Chunking by Speaker Turn

For dialogues with speaker labels (e.g., `ΣΩ.` for Socrates, `ΚΡ.` for Crito), you can chunk by speaking turn:

```python
def chunk_by_speaker(text: str) -> list[dict]:
    """Split dialogue text by speaker turns."""
    pattern = r'(ΣΩ\.|ΚΡ\.|ΓΛ\.|ΑΔ\.|ΠΡΩ\.|ΓΟΡ\.|ΠΩΛ\.|ΚΑΛ\.)'
    turns = re.split(pattern, text)
    result = []
    for i in range(1, len(turns), 2):
        if i + 1 < len(turns):
            result.append({
                "speaker": turns[i].rstrip('.'),
                "text": turns[i + 1].strip()
            })
    return result
```

---

## JSON Schema for Metadata

Use this schema when building metadata files for each text:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["id", "author", "work", "greek_title", "english_title"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier: author/work (e.g., 'plato/republic')"
    },
    "author": {
      "type": "string",
      "enum": ["plato", "xenophon", "aristophanes"]
    },
    "work": {
      "type": "string",
      "description": "Directory name (e.g., 'republic', 'memorabilia')"
    },
    "greek_title": {
      "type": "string",
      "description": "Title in polytonic Greek"
    },
    "english_title": {
      "type": "string",
      "description": "Standard English title"
    },
    "tlg_id": {
      "type": "string",
      "description": "TLG identifier (e.g., 'tlg0059.tlg030' for Republic)"
    },
    "edition": {
      "type": "string",
      "description": "Critical edition used"
    },
    "period": {
      "type": "string",
      "enum": ["early", "transitional", "middle", "late", "disputed", "n/a"],
      "description": "Compositional period (Plato only)"
    },
    "themes": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Primary philosophical themes"
    },
    "dramatic_date": {
      "type": "string",
      "description": "Approximate dramatic setting (e.g., '399 BCE')"
    },
    "socrates_role": {
      "type": "string",
      "enum": ["primary_speaker", "secondary_speaker", "minor_role", "character"],
      "description": "Socrates' role in the text"
    },
    "interlocutors": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Named characters who speak"
    },
    "authenticity": {
      "type": "object",
      "properties": {
        "status": { "type": "string", "enum": ["undisputed", "disputed"] },
        "notes": { "type": "string" }
      }
    },
    "connections": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "text_id": { "type": "string" },
          "relationship": { "type": "string" },
          "note": { "type": "string" }
        }
      },
      "description": "Cross-references to other texts in the corpus"
    },
    "stats": {
      "type": "object",
      "properties": {
        "byte_size": { "type": "integer" },
        "section_count": { "type": "integer" },
        "estimated_tokens": { "type": "integer" }
      }
    }
  }
}
```

### TLG Reference Table

The Thesaurus Linguae Graecae (TLG) identifiers for this corpus, as used in the `scripts/fetch_texts.py` script:

| Author TLG | Author | Work TLG | Work |
|------------|--------|----------|------|
| tlg0059 | Plato | tlg001 | Euthyphro |
| tlg0059 | Plato | tlg002 | Apology |
| tlg0059 | Plato | tlg003 | Crito |
| tlg0059 | Plato | tlg004 | Phaedo |
| tlg0059 | Plato | tlg005 | Cratylus |
| tlg0059 | Plato | tlg006 | Theaetetus |
| tlg0059 | Plato | tlg007 | Sophist |
| tlg0059 | Plato | tlg008 | Statesman |
| tlg0059 | Plato | tlg009 | Parmenides |
| tlg0059 | Plato | tlg010 | Philebus |
| tlg0059 | Plato | tlg011 | Symposium |
| tlg0059 | Plato | tlg012 | Phaedrus |
| tlg0059 | Plato | tlg013 | Alcibiades I |
| tlg0059 | Plato | tlg018 | Charmides |
| tlg0059 | Plato | tlg019 | Laches |
| tlg0059 | Plato | tlg020 | Lysis |
| tlg0059 | Plato | tlg021 | Euthydemus |
| tlg0059 | Plato | tlg022 | Protagoras |
| tlg0059 | Plato | tlg023 | Gorgias |
| tlg0059 | Plato | tlg024 | Meno |
| tlg0059 | Plato | tlg025 | Hippias Major |
| tlg0059 | Plato | tlg026 | Hippias Minor |
| tlg0059 | Plato | tlg027 | Ion |
| tlg0059 | Plato | tlg028 | Menexenus |
| tlg0059 | Plato | tlg029 | Clitophon |
| tlg0059 | Plato | tlg030 | Republic |
| tlg0059 | Plato | tlg031 | Timaeus |
| tlg0059 | Plato | tlg032 | Critias |
| tlg0032 | Xenophon | tlg002 | Memorabilia |
| tlg0032 | Xenophon | tlg003 | Oeconomicus |
| tlg0032 | Xenophon | tlg004 | Symposium |
| tlg0032 | Xenophon | tlg011 | Apology |
| tlg0019 | Aristophanes | tlg003 | Clouds |

---

## Embedding Strategies

### Recommended Chunk Sizes

| Strategy | Chunk Size | Overlap | Best For |
|----------|-----------|---------|----------|
| Section-level | 1 Stephanus section | None | Precise retrieval and citation |
| Paragraph-level | 2-3 sections | 1 section | Argument-level retrieval |
| Fixed-token | 512 tokens | 64 tokens | Uniform embedding dimensions |
| Full-text | Entire dialogue | None | Small dialogues only (<50K tokens) |

### Section-Level Chunking (Recommended)

```python
def chunk_by_section(filepath: str) -> list[dict]:
    """Create one chunk per Stephanus/numbered section."""
    sections = parse_sections(filepath)
    chunks = []

    for section in sections:
        chunk_id = f"{section.get('author', 'unknown')}/{section.get('work', 'unknown')}/{section['section']}"
        chunks.append({
            "id": chunk_id,
            "text": section["text"],
            "metadata": {
                "author": section.get("author", ""),
                "work": section.get("work", ""),
                "section": section["section"],
                "source_path": filepath,
            }
        })

    return chunks
```

### Sliding Window with Section Awareness

```python
def chunk_with_context(filepath: str, window: int = 3, stride: int = 1) -> list[dict]:
    """Create overlapping chunks of N consecutive sections."""
    sections = parse_sections(filepath)
    chunks = []

    for i in range(0, len(sections), stride):
        window_sections = sections[i:i + window]
        if not window_sections:
            break

        combined_text = "\n\n".join(s["text"] for s in window_sections)
        section_range = f"{window_sections[0]['section']}-{window_sections[-1]['section']}"

        chunks.append({
            "id": f"{window_sections[0].get('author', '')}/{window_sections[0].get('work', '')}/{section_range}",
            "text": combined_text,
            "metadata": {
                "sections": [s["section"] for s in window_sections],
                "author": window_sections[0].get("author", ""),
                "work": window_sections[0].get("work", ""),
            }
        })

    return chunks
```

### Embedding Model Selection

Most embedding models are trained primarily on modern languages. For Ancient Greek:

| Model | Dimensions | Greek Quality | Notes |
|-------|-----------|---------------|-------|
| `text-embedding-3-large` (OpenAI) | 3072 | Good | Best commercial option for multilingual |
| `voyage-multilingual-2` (Voyage AI) | 1024 | Good | Strong on non-Latin scripts |
| `multilingual-e5-large` (open source) | 1024 | Fair | Good open-source baseline |
| `BGE-M3` (open source) | 1024 | Fair | Handles multiple retrieval modes |

Always test retrieval quality on known passages before committing. A simple evaluation:

```python
def test_greek_embeddings(model, texts: list[str], queries: list[str]):
    """Verify that an embedding model produces meaningful similarities for Greek."""
    from numpy import dot
    from numpy.linalg import norm

    text_embs = [model.encode(t) for t in texts]
    query_embs = [model.encode(q) for q in queries]

    for q, q_emb in zip(queries, query_embs):
        sims = [
            (t[:60], dot(q_emb, t_emb) / (norm(q_emb) * norm(t_emb)))
            for t, t_emb in zip(texts, text_embs)
        ]
        sims.sort(key=lambda x: x[1], reverse=True)
        print(f"\nQuery: {q}")
        for preview, score in sims[:5]:
            print(f"  {score:.3f}  {preview}...")
```

---

## Building a "Talk to Socrates" Bot

### Architecture

```
User Query
    |
    v
[Retrieval Layer] -- query vector DB for relevant passages
    |
    v
[Context Assembly] -- combine retrieved passages with system prompt
    |
    v
[LLM Generation] -- generate response in character
    |
    v
[Citation Layer] -- attach Stephanus/section references
    |
    v
Response with Citations
```

### System Prompt

The system prompt determines whether you get a thoughtful Socratic interlocutor or a shallow chatbot wearing a toga. Ground it in the actual texts:

```
You are an AI assistant that responds in the manner of Socrates as portrayed
in the primary sources: Plato's dialogues, Xenophon's Socratic works, and
Aristophanes' Clouds.

Ground rules:
- Draw your responses from the Greek source texts provided in context.
  When you reference a specific idea, cite the text and Stephanus/section number.
- Prefer Socratic method: ask clarifying questions, examine assumptions,
  and seek definitions rather than making declarations.
- Do not attribute ideas from Plato's middle and late dialogues (Theory of Forms,
  tripartite soul, philosopher-king) to the historical Socrates without noting
  that these are Plato's developments.
- When the user asks about a topic that multiple sources address differently,
  present the different perspectives rather than synthesizing them into one view.
- Respond in English, but cite key Greek terms in parentheses where they
  illuminate the discussion.
- You may speak in the first person as Socrates for dramatic purposes, but
  always break character to provide scholarly context when accuracy requires it.
```

### Implementation with Claude Context Caching

The simplest approach: no vector database, no embeddings. Load a subset of the corpus directly into Claude's cached context.

```python
import anthropic
from pathlib import Path

client = anthropic.Anthropic()

# Load the trial-and-death sequence (~225 KB, ~100K tokens)
trial_texts = ["euthyphro", "apology", "crito", "phaedo"]
corpus_text = ""
for dialogue in trial_texts:
    path = Path(f"texts/plato/{dialogue}/text.md")
    if path.exists():
        corpus_text += f"\n\n{'='*60}\n" + path.read_text(encoding="utf-8")

SYSTEM_PROMPT = f"""You are a scholar of Ancient Greek philosophy with the text
of Plato's trial-and-death dialogues loaded for reference. These are in the
original Ancient Greek from the Burnet OCT edition.

When answering:
- Cite specific Stephanus references
- Quote the relevant Greek when a term or phrase matters
- Distinguish between what the text says and scholarly interpretation

CORPUS:
{corpus_text}"""

def ask(question: str, history: list = None):
    messages = history or []
    messages.append({"role": "user", "content": question})

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        system=[{
            "type": "text",
            "text": SYSTEM_PROMPT,
            "cache_control": {"type": "ephemeral"}
        }],
        messages=messages,
    )
    return response.content[0].text
```

### Implementation with LangChain

```python
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_anthropic import ChatAnthropic
from langchain.chains import ConversationalRetrievalChain
from pathlib import Path
import re

# 1. Load and chunk the corpus
def load_corpus(texts_dir: str) -> list[dict]:
    docs = []
    for text_file in Path(texts_dir).rglob("text.md"):
        content = text_file.read_text(encoding="utf-8")
        parts = text_file.relative_to(texts_dir).parts
        author, work = parts[0], parts[1]

        sections = re.split(r"^(### .+)$", content, flags=re.MULTILINE)
        for i in range(1, len(sections), 2):
            header = sections[i].strip("# \n")
            body = sections[i + 1].strip() if i + 1 < len(sections) else ""
            if body:
                docs.append({
                    "content": body,
                    "metadata": {
                        "author": author,
                        "work": work,
                        "section": header,
                        "source": f"{author}/{work}",
                    }
                })
    return docs

# 2. Create vector store
embeddings = HuggingFaceEmbeddings(model_name="intfloat/multilingual-e5-large")
corpus_docs = load_corpus("texts/")

vectorstore = Chroma.from_texts(
    texts=[d["content"] for d in corpus_docs],
    metadatas=[d["metadata"] for d in corpus_docs],
    embedding=embeddings,
    persist_directory="./socrates_vectordb"
)

# 3. Create the chain
llm = ChatAnthropic(model="claude-sonnet-4-20250514", max_tokens=2048)
chain = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=vectorstore.as_retriever(search_kwargs={"k": 8}),
    return_source_documents=True,
)
```

### Implementation with LlamaIndex

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
from llama_index.core.node_parser import MarkdownNodeParser
from llama_index.llms.anthropic import Anthropic
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

Settings.llm = Anthropic(model="claude-sonnet-4-20250514")
Settings.embed_model = HuggingFaceEmbedding(model_name="intfloat/multilingual-e5-large")

documents = SimpleDirectoryReader(
    input_dir="texts/",
    recursive=True,
    required_exts=[".md"],
).load_data()

parser = MarkdownNodeParser()
nodes = parser.get_nodes_from_documents(documents)

index = VectorStoreIndex(nodes)
query_engine = index.as_query_engine(similarity_top_k=8)

response = query_engine.query(
    "What does Socrates say about the relationship between knowledge and virtue?"
)
print(response)
for node in response.source_nodes:
    print(f"  - {node.metadata.get('file_path', 'unknown')} (score: {node.score:.3f})")
```

---

## Integration Patterns

### Pattern 1: Search and Cite

User asks a question in English. The system retrieves relevant Greek passages, sends them to the LLM with the question, and returns an answer with Stephanus citations. Best for research assistants and scholarly reference tools.

### Pattern 2: Guided Reading

User selects a dialogue. The system walks through it section by section, offering commentary, vocabulary help, and connections to other texts. Best for educational applications and Greek language learning.

### Pattern 3: Comparative Analysis

User specifies a topic (e.g., "justice," "courage," "the soul"). The system retrieves all relevant passages across authors, groups them, and produces a structured comparison. Best for thematic research and essay preparation.

### Pattern 4: Philosophical Dialogue

User engages in Socratic conversation. The system responds in character using elenchus (cross-examination), draws on actual arguments from the texts, and cites sources. Best for interactive learning and demonstration projects.

---

## Testing and Validation

### Sanity Checks for Your Pipeline

**1. Section count verification.** Parse every file and count sections. The Republic should have hundreds. Clitophon should have very few. If your parser returns zero sections, it is not handling `###` headers correctly.

**2. Greek text detection.** Verify that chunks contain actual Greek, not just Markdown headers:

```python
import unicodedata

def is_greek(text: str) -> bool:
    greek_chars = sum(
        1 for c in text
        if unicodedata.category(c).startswith('L')
        and 'GREEK' in unicodedata.name(c, '')
    )
    letter_chars = sum(1 for c in text if unicodedata.category(c).startswith('L'))
    return letter_chars > 0 and greek_chars / letter_chars > 0.5
```

**3. Cross-reference test.** Ask your system about a topic that spans multiple texts (e.g., "What is courage?") and verify it retrieves from both Laches (the explicit topic) and other dialogues where courage appears incidentally.

**4. Attribution test.** Ask "What does Xenophon's Socrates say about X?" and verify the system returns only passages from the four Xenophon texts, not from Plato.

**5. Completeness check.** Verify all 33 texts are indexed:

```python
from pathlib import Path

expected = {
    "plato": 28,
    "xenophon": 4,
    "aristophanes": 1,
}

for author, count in expected.items():
    actual = len(list(Path(f"texts/{author}").iterdir()))
    assert actual == count, f"{author}: expected {count}, got {actual}"
```

---

## Licensing

The Greek texts are sourced from the Perseus Digital Library (CC BY-SA 3.0 US) and the First1KGreek Project (CC BY-SA 4.0). Any derivative work -- including vector databases, fine-tuned models, and applications -- must comply with the ShareAlike provisions. See `SOURCES.md` and `LICENSE` for full details.
