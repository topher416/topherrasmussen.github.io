#!/usr/bin/env python3
"""Count characters, words, and estimate tokens for each text in the corpus.

Uses character_count / 2.5 as a rough token estimate for Greek text
(Greek characters encode to more bytes and tokens than Latin text).

Usage:
    python scripts/count_tokens.py
    python scripts/count_tokens.py --author plato
    python scripts/count_tokens.py --sort tokens
    python scripts/count_tokens.py --json
"""

import argparse
import json
import os
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEXTS_DIR = os.path.join(REPO_ROOT, "texts")

GREEK_CHARS_PER_TOKEN = 2.5  # Rough estimate for polytonic Greek


def analyze_text(text_path):
    """Analyze a text file and return stats."""
    try:
        with open(text_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        return None

    # Full file stats
    total_chars = len(content)
    total_lines = content.count("\n") + 1

    # Strip markdown formatting for pure text stats
    lines = content.split("\n")
    header_lines = []
    text_lines = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("#") or stripped.startswith("**") or stripped == "---" or stripped == "":
            header_lines.append(line)
        else:
            text_lines.append(line)

    greek_text = "\n".join(text_lines).strip()
    char_count = len(greek_text)
    word_count = len(greek_text.split()) if greek_text else 0
    section_count = sum(1 for l in lines if l.startswith("### "))

    # Byte count (Greek is multi-byte in UTF-8)
    byte_count = len(greek_text.encode("utf-8"))

    # Token estimate
    est_tokens = int(char_count / GREEK_CHARS_PER_TOKEN)

    return {
        "char_count": char_count,
        "word_count": word_count,
        "byte_count": byte_count,
        "section_count": section_count,
        "line_count": total_lines,
        "est_tokens": est_tokens,
    }


def discover_texts(author_filter=None):
    """Find all text.md files in the corpus."""
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
            if os.path.isfile(text_path):
                # Try to get title from metadata.json or text.md header
                title = work_slug
                meta_path = os.path.join(work_dir, "metadata.json")
                if os.path.isfile(meta_path):
                    try:
                        with open(meta_path, "r", encoding="utf-8") as f:
                            meta = json.load(f)
                        title = meta.get("title", work_slug)
                    except (json.JSONDecodeError, KeyError):
                        pass
                else:
                    # Fall back to text.md second line (## Title — Author)
                    try:
                        with open(text_path, "r", encoding="utf-8") as f:
                            for line in f:
                                if line.startswith("## "):
                                    title = line.strip("# \n").split("—")[0].strip()
                                    break
                    except Exception:
                        pass

                texts.append({
                    "author": author_slug,
                    "work": work_slug,
                    "title": title,
                    "path": text_path,
                })
    return texts


def print_table(texts_with_stats, sort_key="author"):
    """Print a formatted table of text statistics."""
    # Column widths
    col_author = 13
    col_title = 22
    col_chars = 12
    col_words = 10
    col_bytes = 12
    col_sections = 10
    col_tokens = 12

    header = (
        f"{'Author':<{col_author}} "
        f"{'Title':<{col_title}} "
        f"{'Chars':>{col_chars}} "
        f"{'Words':>{col_words}} "
        f"{'Bytes':>{col_bytes}} "
        f"{'Sections':>{col_sections}} "
        f"{'Est.Tokens':>{col_tokens}}"
    )
    separator = "-" * len(header)

    print(separator)
    print(header)
    print(separator)

    # Sort
    if sort_key == "tokens":
        texts_with_stats.sort(key=lambda x: x["stats"]["est_tokens"], reverse=True)
    elif sort_key == "chars":
        texts_with_stats.sort(key=lambda x: x["stats"]["char_count"], reverse=True)
    elif sort_key == "words":
        texts_with_stats.sort(key=lambda x: x["stats"]["word_count"], reverse=True)
    else:
        texts_with_stats.sort(key=lambda x: (x["info"]["author"], x["info"]["work"]))

    totals = {"char_count": 0, "word_count": 0, "byte_count": 0, "section_count": 0, "est_tokens": 0}

    for item in texts_with_stats:
        info = item["info"]
        s = item["stats"]
        title_display = info["title"][:col_title]
        author_display = info["author"][:col_author]

        print(
            f"{author_display:<{col_author}} "
            f"{title_display:<{col_title}} "
            f"{s['char_count']:>{col_chars},} "
            f"{s['word_count']:>{col_words},} "
            f"{s['byte_count']:>{col_bytes},} "
            f"{s['section_count']:>{col_sections},} "
            f"{s['est_tokens']:>{col_tokens},}"
        )
        for key in totals:
            totals[key] += s[key]

    print(separator)
    print(
        f"{'TOTAL':<{col_author}} "
        f"{len(texts_with_stats):>{col_title}} texts "
        f"{totals['char_count']:>{col_chars},} "
        f"{totals['word_count']:>{col_words},} "
        f"{totals['byte_count']:>{col_bytes},} "
        f"{totals['section_count']:>{col_sections},} "
        f"{totals['est_tokens']:>{col_tokens},}"
    )
    print(separator)

    # Per-author summary
    authors = sorted(set(item["info"]["author"] for item in texts_with_stats))
    if len(authors) > 1:
        print("\nPer-author summary:")
        for author in authors:
            author_items = [item for item in texts_with_stats if item["info"]["author"] == author]
            a_chars = sum(item["stats"]["char_count"] for item in author_items)
            a_words = sum(item["stats"]["word_count"] for item in author_items)
            a_tokens = sum(item["stats"]["est_tokens"] for item in author_items)
            pct = (a_chars / totals["char_count"] * 100) if totals["char_count"] else 0
            print(
                f"  {author:<13} {len(author_items):>3} texts | "
                f"{a_chars:>10,} chars | "
                f"{a_words:>8,} words | "
                f"{a_tokens:>10,} est.tokens | "
                f"{pct:>5.1f}% of corpus"
            )


def main():
    parser = argparse.ArgumentParser(
        description="Count characters, words, and estimate tokens for corpus texts."
    )
    parser.add_argument(
        "--author",
        choices=["plato", "xenophon", "aristophanes"],
        help="Filter by author",
    )
    parser.add_argument(
        "--sort",
        choices=["author", "tokens", "chars", "words"],
        default="author",
        help="Sort order (default: author)",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output as JSON instead of table",
    )
    args = parser.parse_args()

    texts = discover_texts(author_filter=args.author)
    if not texts:
        print("No texts found.", file=sys.stderr)
        sys.exit(1)

    results = []
    for info in texts:
        stats = analyze_text(info["path"])
        if stats is None:
            print(f"WARNING: Could not read {info['path']}", file=sys.stderr)
            continue
        results.append({"info": info, "stats": stats})

    if args.json:
        output = []
        for item in results:
            entry = {
                "text_id": f"{item['info']['author']}.{item['info']['work']}",
                "author": item["info"]["author"],
                "title": item["info"]["title"],
            }
            entry.update(item["stats"])
            output.append(entry)
        print(json.dumps(output, ensure_ascii=False, indent=2))
    else:
        print(f"\nSocrates-Source Corpus — Token Count Report")
        print(f"(Token estimate: chars / {GREEK_CHARS_PER_TOKEN} for Greek text)\n")
        print_table(results, sort_key=args.sort)


if __name__ == "__main__":
    main()
