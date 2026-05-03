#!/usr/bin/env python3
"""Add a new entry to journal.json.

Usage:
    python3 add_journal.py "entry title" "first paragraph" "second paragraph"
    echo "body text here" | python3 add_journal.py "entry title" --stdin
"""

import datetime
import json
import os
import re
import subprocess
import sys
import unicodedata


def slugify(text):
    """Create a URL-safe slug from text."""
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^\w\s-]", "", text.lower())
    text = re.sub(r"[\s_]+", "-", text.strip())
    return text


def format_display_date(dt):
    """Format datetime as 'May 3, 2026 — 8:47pm'.

    The display date uses %-d and %-I for non-zero-padded formatting on Unix,
    with a Windows fallback using #. Only the AM/PM suffix is lowercased.
    """
    try:
        formatted = dt.strftime("%B %-d, %Y \u2014 %-I:%M%p")
    except ValueError:
        formatted = dt.strftime("%B %#d, %Y \u2014 %#I:%M%p")

    # Lowercase only the AM/PM suffix (always last 2 characters)
    return formatted[:-2] + formatted[-2:].lower()


def main():
    args = sys.argv[1:]

    if not args:
        print("Error: title is required.", file=sys.stderr)
        print('Usage: python3 add_journal.py "title" "paragraph1" "paragraph2"', file=sys.stderr)
        print('   or: echo "body text" | python3 add_journal.py "title" --stdin', file=sys.stderr)
        sys.exit(1)

    title = args[0]
    use_stdin = False
    body_paragraphs = []

    if "--stdin" in args:
        use_stdin = True
        if sys.stdin.isatty():
            print("Error: --stdin flag used but no data piped to stdin.", file=sys.stderr)
            sys.exit(1)
        raw = sys.stdin.read().strip()
        if not raw:
            print("Error: empty body from stdin.", file=sys.stderr)
            sys.exit(1)
        body_paragraphs = [p.strip() for p in raw.split("\n\n") if p.strip()]
    else:
        body_paragraphs = [p for p in args[1:] if p.strip()]

    if not body_paragraphs:
        print("Error: body text is required. Provide paragraphs as arguments or via --stdin.", file=sys.stderr)
        sys.exit(1)

    now = datetime.datetime.now()
    entry = {
        "date": now.strftime("%Y-%m-%d"),
        "datetime": now.isoformat(),
        "display_date": format_display_date(now),
        "slug": slugify(title),
        "title": title,
        "body": body_paragraphs,
    }

    journal_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "journal.json")
    entries = []

    if os.path.exists(journal_path):
        with open(journal_path, "r", encoding="utf-8") as f:
            entries = json.load(f)
        if not isinstance(entries, list):
            print("Error: journal.json does not contain a list.", file=sys.stderr)
            sys.exit(1)

    entries.insert(0, entry)

    try:
        with open(journal_path, "w", encoding="utf-8") as f:
            json.dump(entries, f, indent=2, ensure_ascii=False)
            f.write("\n")
    except IOError as exc:
        print(f"Error writing journal.json: {exc}", file=sys.stderr)
        sys.exit(1)

    # Validate by reading back
    try:
        with open(journal_path, "r", encoding="utf-8") as f:
            json.load(f)
    except (json.JSONDecodeError, IOError) as exc:
        print(f"Error: journal validation failed after write: {exc}", file=sys.stderr)
        sys.exit(1)

    print(f"Added entry: \"{title}\"")
    print(f"  Slug: {entry['slug']}")
    print(f"  Date: {entry['date']}")

    # Regenerate RSS feed
    script_dir = os.path.dirname(os.path.abspath(__file__))
    subprocess.run(
        [sys.executable, os.path.join(script_dir, "scripts", "generate_feed.py")],
        cwd=script_dir,
    )


if __name__ == "__main__":
    main()
