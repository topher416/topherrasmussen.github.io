#!/usr/bin/env python3
"""Aggregate all metadata.json files into a single corpus.json master index.

If metadata.json files don't exist yet, generates them from text.md headers
and the work mappings used during corpus fetch.

Usage:
    python scripts/build_corpus_json.py [--generate-metadata]
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEXTS_DIR = os.path.join(REPO_ROOT, "texts")
CORPUS_JSON = os.path.join(REPO_ROOT, "corpus.json")

# Work metadata derived from fetch_texts.py mappings and SOURCES.md
WORK_INFO = {
    "plato": {
        "author_greek": "Πλάτων",
        "author_english": "Plato",
        "tlg_author": "tlg0059",
        "edition": "Burnet, Platonis Opera, OCT 1900-1907",
        "source": "Perseus Digital Library",
        "license": "CC BY-SA 3.0 US",
        "language": "grc",
        "works": {
            "euthyphro":    {"greek_title": "Εὐθύφρων",            "english_title": "Euthyphro",            "tlg_work": "tlg001"},
            "apology":      {"greek_title": "Ἀπολογία Σωκράτους",  "english_title": "Apology of Socrates",  "tlg_work": "tlg002"},
            "crito":        {"greek_title": "Κρίτων",              "english_title": "Crito",                "tlg_work": "tlg003"},
            "phaedo":       {"greek_title": "Φαίδων",              "english_title": "Phaedo",               "tlg_work": "tlg004"},
            "cratylus":     {"greek_title": "Κρατύλος",            "english_title": "Cratylus",             "tlg_work": "tlg005"},
            "theaetetus":   {"greek_title": "Θεαίτητος",           "english_title": "Theaetetus",           "tlg_work": "tlg006"},
            "sophist":      {"greek_title": "Σοφιστής",            "english_title": "Sophist",              "tlg_work": "tlg007"},
            "statesman":    {"greek_title": "Πολιτικός",           "english_title": "Statesman",            "tlg_work": "tlg008"},
            "parmenides":   {"greek_title": "Παρμενίδης",          "english_title": "Parmenides",           "tlg_work": "tlg009"},
            "philebus":     {"greek_title": "Φίληβος",             "english_title": "Philebus",             "tlg_work": "tlg010"},
            "symposium":    {"greek_title": "Συμπόσιον",           "english_title": "Symposium",            "tlg_work": "tlg011"},
            "phaedrus":     {"greek_title": "Φαῖδρος",             "english_title": "Phaedrus",             "tlg_work": "tlg012"},
            "alcibiades-i": {"greek_title": "Ἀλκιβιάδης Αʹ",      "english_title": "Alcibiades I",         "tlg_work": "tlg013"},
            "charmides":    {"greek_title": "Χαρμίδης",            "english_title": "Charmides",            "tlg_work": "tlg018"},
            "laches":       {"greek_title": "Λάχης",               "english_title": "Laches",               "tlg_work": "tlg019"},
            "lysis":        {"greek_title": "Λύσις",               "english_title": "Lysis",                "tlg_work": "tlg020"},
            "euthydemus":   {"greek_title": "Εὐθύδημος",           "english_title": "Euthydemus",           "tlg_work": "tlg021"},
            "protagoras":   {"greek_title": "Πρωταγόρας",          "english_title": "Protagoras",           "tlg_work": "tlg022"},
            "gorgias":      {"greek_title": "Γοργίας",             "english_title": "Gorgias",              "tlg_work": "tlg023"},
            "meno":         {"greek_title": "Μένων",               "english_title": "Meno",                 "tlg_work": "tlg024"},
            "hippias-major":{"greek_title": "Ἱππίας μείζων",       "english_title": "Hippias Major",        "tlg_work": "tlg025"},
            "hippias-minor":{"greek_title": "Ἱππίας ἐλάττων",      "english_title": "Hippias Minor",        "tlg_work": "tlg026"},
            "ion":          {"greek_title": "Ἴων",                  "english_title": "Ion",                  "tlg_work": "tlg027"},
            "menexenus":    {"greek_title": "Μενέξενος",            "english_title": "Menexenus",            "tlg_work": "tlg028"},
            "clitophon":    {"greek_title": "Κλειτοφῶν",            "english_title": "Clitophon",            "tlg_work": "tlg029"},
            "republic":     {"greek_title": "Πολιτεία",             "english_title": "Republic",             "tlg_work": "tlg030"},
            "timaeus":      {"greek_title": "Τίμαιος",              "english_title": "Timaeus",              "tlg_work": "tlg031"},
            "critias":      {"greek_title": "Κριτίας",              "english_title": "Critias",              "tlg_work": "tlg032"},
        },
    },
    "xenophon": {
        "author_greek": "Ξενοφῶν",
        "author_english": "Xenophon",
        "tlg_author": "tlg0032",
        "edition": "Marchant, Xenophontis Opera Omnia, OCT 1900-1920",
        "source": "Perseus Digital Library",
        "license": "CC BY-SA 3.0 US",
        "language": "grc",
        "works": {
            "memorabilia":  {"greek_title": "Ἀπομνημονεύματα",     "english_title": "Memorabilia",          "tlg_work": "tlg002"},
            "apology":      {"greek_title": "Ἀπολογία Σωκράτους",  "english_title": "Apology of Socrates",  "tlg_work": "tlg011"},
            "symposium":    {"greek_title": "Συμπόσιον",            "english_title": "Symposium",            "tlg_work": "tlg004"},
            "oeconomicus":  {"greek_title": "Οἰκονομικός",          "english_title": "Oeconomicus",          "tlg_work": "tlg003"},
        },
    },
    "aristophanes": {
        "author_greek": "Ἀριστοφάνης",
        "author_english": "Aristophanes",
        "tlg_author": "tlg0019",
        "edition": "Hall & Geldart, Aristophanis Comoediae, OCT 1906-1907",
        "source": "Perseus Digital Library",
        "license": "CC BY-SA 3.0 US",
        "language": "grc",
        "works": {
            "clouds":       {"greek_title": "Νεφέλαι",              "english_title": "The Clouds",           "tlg_work": "tlg003"},
        },
    },
}


def get_text_stats(text_path):
    """Get character and word counts for a text file."""
    try:
        with open(text_path, "r", encoding="utf-8") as f:
            content = f.read()
        # Strip markdown headers and formatting for pure text stats
        lines = content.split("\n")
        text_lines = [l for l in lines if not l.startswith("#") and not l.startswith("**") and l.strip() != "---"]
        text_only = "\n".join(text_lines).strip()
        char_count = len(text_only)
        word_count = len(text_only.split())
        section_count = sum(1 for l in lines if l.startswith("### "))
        return {
            "character_count": char_count,
            "word_count": word_count,
            "section_count": section_count,
        }
    except FileNotFoundError:
        return None


def generate_metadata(author_slug, work_slug, author_info, work_info, text_path):
    """Generate a metadata dict for a single work."""
    stats = get_text_stats(text_path) or {}
    text_id = f"{author_slug}.{work_slug}"

    # Determine related works (same-author cross-references)
    related = [
        f"{author_slug}.{w}"
        for w in author_info["works"]
        if w != work_slug
    ]

    metadata = {
        "text_id": text_id,
        "author": author_info["author_english"],
        "author_greek": author_info["author_greek"],
        "title": work_info["english_title"],
        "title_greek": work_info["greek_title"],
        "tlg_author": author_info["tlg_author"],
        "tlg_work": work_info["tlg_work"],
        "language": author_info["language"],
        "edition": author_info["edition"],
        "source": author_info["source"],
        "license": author_info["license"],
        "text_file": "text.md",
        "character_count": stats.get("character_count", 0),
        "word_count": stats.get("word_count", 0),
        "section_count": stats.get("section_count", 0),
        "related_texts": related,
    }
    return metadata


def generate_all_metadata(dry_run=False):
    """Generate metadata.json for all works that don't have one yet."""
    generated = 0
    for author_slug, author_info in WORK_INFO.items():
        for work_slug, work_info in author_info["works"].items():
            work_dir = os.path.join(TEXTS_DIR, author_slug, work_slug)
            text_path = os.path.join(work_dir, "text.md")
            meta_path = os.path.join(work_dir, "metadata.json")

            if not os.path.isfile(text_path):
                print(f"  SKIP (no text.md): {author_slug}/{work_slug}")
                continue

            if os.path.isfile(meta_path):
                print(f"  EXISTS: {author_slug}/{work_slug}/metadata.json")
                continue

            metadata = generate_metadata(author_slug, work_slug, author_info, work_info, text_path)

            if not dry_run:
                with open(meta_path, "w", encoding="utf-8") as f:
                    json.dump(metadata, f, ensure_ascii=False, indent=2)
                    f.write("\n")

            print(f"  GENERATED: {author_slug}/{work_slug}/metadata.json")
            generated += 1

    return generated


def build_corpus_json():
    """Read all metadata.json files and build the corpus.json master index."""
    texts = []
    errors = []

    for author_slug in sorted(os.listdir(TEXTS_DIR)):
        author_dir = os.path.join(TEXTS_DIR, author_slug)
        if not os.path.isdir(author_dir):
            continue

        for work_slug in sorted(os.listdir(author_dir)):
            work_dir = os.path.join(author_dir, work_slug)
            meta_path = os.path.join(work_dir, "metadata.json")

            if not os.path.isfile(meta_path):
                errors.append(f"Missing metadata.json: {author_slug}/{work_slug}")
                continue

            try:
                with open(meta_path, "r", encoding="utf-8") as f:
                    metadata = json.load(f)
                texts.append(metadata)
            except json.JSONDecodeError as e:
                errors.append(f"Invalid JSON in {author_slug}/{work_slug}/metadata.json: {e}")
            except Exception as e:
                errors.append(f"Error reading {author_slug}/{work_slug}/metadata.json: {e}")

    # Compute summary stats
    total_chars = sum(t.get("character_count", 0) for t in texts)
    total_words = sum(t.get("word_count", 0) for t in texts)
    total_sections = sum(t.get("section_count", 0) for t in texts)
    authors = sorted(set(t.get("author", "unknown") for t in texts))

    corpus = {
        "corpus": "socrates-source",
        "description": "Greek source texts featuring Socrates: Plato's dialogues, Xenophon's Socratic works, and Aristophanes' Clouds",
        "generated_at": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "summary": {
            "total_texts": len(texts),
            "total_characters": total_chars,
            "total_words": total_words,
            "total_sections": total_sections,
            "estimated_tokens": int(total_chars / 2.5),
            "authors": authors,
            "texts_by_author": {
                a: sum(1 for t in texts if t.get("author") == a)
                for a in authors
            },
        },
        "texts": texts,
    }

    with open(CORPUS_JSON, "w", encoding="utf-8") as f:
        json.dump(corpus, f, ensure_ascii=False, indent=2)
        f.write("\n")

    return corpus, errors


def main():
    parser = argparse.ArgumentParser(
        description="Build corpus.json master index from individual metadata.json files."
    )
    parser.add_argument(
        "--generate-metadata",
        action="store_true",
        help="Generate metadata.json for works that don't have one yet",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be generated without writing files",
    )
    args = parser.parse_args()

    if args.generate_metadata:
        print("=== Generating missing metadata.json files ===")
        count = generate_all_metadata(dry_run=args.dry_run)
        if args.dry_run:
            print(f"\nWould generate {count} metadata.json files (dry run)")
        else:
            print(f"\nGenerated {count} metadata.json files")

    # Check if any metadata.json files exist
    has_metadata = any(
        os.path.isfile(os.path.join(TEXTS_DIR, a, w, "metadata.json"))
        for a in os.listdir(TEXTS_DIR)
        if os.path.isdir(os.path.join(TEXTS_DIR, a))
        for w in os.listdir(os.path.join(TEXTS_DIR, a))
        if os.path.isdir(os.path.join(TEXTS_DIR, a, w))
    )

    if not has_metadata:
        print("\nNo metadata.json files found. Run with --generate-metadata first.")
        sys.exit(1)

    if args.dry_run:
        print("\nDry run — skipping corpus.json build")
        return

    print("\n=== Building corpus.json ===")
    corpus, errors = build_corpus_json()

    if errors:
        print("\nWarnings:")
        for e in errors:
            print(f"  - {e}")

    summary = corpus["summary"]
    print(f"\nCorpus summary:")
    print(f"  Texts:      {summary['total_texts']}")
    print(f"  Characters: {summary['total_characters']:,}")
    print(f"  Words:      {summary['total_words']:,}")
    print(f"  Sections:   {summary['total_sections']:,}")
    print(f"  Est. tokens: {summary['estimated_tokens']:,}")
    print(f"  Authors:    {', '.join(summary['authors'])}")
    for author, count in summary["texts_by_author"].items():
        print(f"    {author}: {count} texts")

    print(f"\nWritten to: {CORPUS_JSON}")


if __name__ == "__main__":
    main()
