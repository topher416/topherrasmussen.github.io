#!/usr/bin/env python3
"""Concatenate corpus texts into a single markdown file.

Useful for loading an entire author's works (or the full corpus) into
an LLM context window as one document.

Usage:
    python scripts/export_single_file.py --author plato --output plato_complete.md
    python scripts/export_single_file.py --author xenophon --include-metadata
    python scripts/export_single_file.py  # all texts to stdout
"""

import argparse
import json
import os
import sys
from datetime import datetime

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEXTS_DIR = os.path.join(REPO_ROOT, "texts")


def discover_texts(author_filter=None):
    """Find all text.md files, optionally filtered by author."""
    texts = []
    for author_slug in sorted(os.listdir(TEXTS_DIR)):
        author_dir = os.path.join(TEXTS_DIR, author_slug)
        if not os.path.isdir(author_dir):
            continue
        if author_filter and author_slug != author_filter:
            continue

        for work_slug in sorted(os.listdir(author_dir)):
            work_dir = os.path.join(author_dir, work_slug)
            text_path = os.path.join(work_dir, "text.md")
            meta_path = os.path.join(work_dir, "metadata.json")

            if not os.path.isfile(text_path):
                continue

            metadata = None
            if os.path.isfile(meta_path):
                try:
                    with open(meta_path, "r", encoding="utf-8") as f:
                        metadata = json.load(f)
                except (json.JSONDecodeError, OSError):
                    pass

            texts.append({
                "author": author_slug,
                "work": work_slug,
                "text_path": text_path,
                "metadata": metadata,
            })
    return texts


def format_metadata_header(metadata):
    """Format metadata as a markdown block to prepend to a text."""
    if not metadata:
        return ""

    lines = []
    lines.append("> **Metadata**")
    lines.append(f"> - **Text ID:** {metadata.get('text_id', 'unknown')}")
    lines.append(f"> - **Author:** {metadata.get('author', 'unknown')} ({metadata.get('author_greek', '')})")
    lines.append(f"> - **Title:** {metadata.get('title', 'unknown')} ({metadata.get('title_greek', '')})")
    lines.append(f"> - **Edition:** {metadata.get('edition', 'unknown')}")
    lines.append(f"> - **Source:** {metadata.get('source', 'unknown')}")
    lines.append(f"> - **License:** {metadata.get('license', 'unknown')}")

    char_count = metadata.get("character_count", 0)
    word_count = metadata.get("word_count", 0)
    section_count = metadata.get("section_count", 0)
    if char_count or word_count:
        lines.append(f"> - **Stats:** {char_count:,} chars, {word_count:,} words, {section_count} sections")

    lines.append("")
    return "\n".join(lines)


def export_texts(texts, include_metadata=False, output_file=None):
    """Concatenate texts into a single markdown document."""
    parts = []

    # Document header
    authors = sorted(set(t["author"] for t in texts))
    if len(authors) == 1:
        title = f"Socrates-Source Corpus: {authors[0].title()}"
    else:
        title = "Socrates-Source Corpus: Complete Collection"

    parts.append(f"# {title}")
    parts.append(f"")
    parts.append(f"Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}")
    parts.append(f"Texts: {len(texts)}")
    parts.append(f"Authors: {', '.join(a.title() for a in authors)}")
    parts.append("")
    parts.append("---")
    parts.append("")

    # Table of contents
    parts.append("## Table of Contents")
    parts.append("")
    current_author = None
    for i, text in enumerate(texts, 1):
        if text["author"] != current_author:
            current_author = text["author"]
            parts.append(f"### {current_author.title()}")
        title = text["work"].replace("-", " ").title()
        if text["metadata"]:
            title = text["metadata"].get("title", title)
            greek = text["metadata"].get("title_greek", "")
            if greek:
                title = f"{title} ({greek})"
        parts.append(f"{i}. {title}")
    parts.append("")
    parts.append("---")
    parts.append("")

    # Texts
    for i, text in enumerate(texts, 1):
        if include_metadata and text["metadata"]:
            parts.append(format_metadata_header(text["metadata"]))

        try:
            with open(text["text_path"], "r", encoding="utf-8") as f:
                content = f.read().strip()
        except OSError as e:
            parts.append(f"*Error reading {text['text_path']}: {e}*")
            content = ""

        parts.append(content)
        parts.append("")
        parts.append("---")
        parts.append("")

    output = "\n".join(parts)

    if output_file:
        try:
            with open(output_file, "w", encoding="utf-8") as f:
                f.write(output)
            # Print summary to stderr so it doesn't mix with potential stdout output
            char_count = len(output)
            print(
                f"Exported {len(texts)} texts ({char_count:,} chars, ~{int(char_count / 2.5):,} est. tokens) to {output_file}",
                file=sys.stderr,
            )
        except OSError as e:
            print(f"Error writing to {output_file}: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        sys.stdout.write(output)
        print(
            f"\n[Exported {len(texts)} texts, {len(output):,} chars to stdout]",
            file=sys.stderr,
        )


def main():
    parser = argparse.ArgumentParser(
        description="Concatenate corpus texts into a single markdown file for LLM context loading."
    )
    parser.add_argument(
        "--author",
        choices=["plato", "xenophon", "aristophanes"],
        help="Filter by author (default: all authors)",
    )
    parser.add_argument(
        "--include-metadata",
        action="store_true",
        help="Prepend each text with a metadata summary block",
    )
    parser.add_argument(
        "--output", "-o",
        metavar="FILE",
        help="Output file path (default: stdout)",
    )
    args = parser.parse_args()

    texts = discover_texts(author_filter=args.author)
    if not texts:
        author_msg = f" for author '{args.author}'" if args.author else ""
        print(f"No texts found{author_msg}.", file=sys.stderr)
        sys.exit(1)

    export_texts(
        texts,
        include_metadata=args.include_metadata,
        output_file=args.output,
    )


if __name__ == "__main__":
    main()
