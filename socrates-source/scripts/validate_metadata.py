#!/usr/bin/env python3
"""Validate metadata.json files across the corpus.

Checks:
  - All required fields present in each metadata.json
  - text_id matches the directory structure (author.work)
  - text_file references resolve to actual files on disk
  - Cross-references in related_texts point to valid text_ids
  - JSON is well-formed
  - No orphan text.md files (texts without metadata)

Usage:
    python scripts/validate_metadata.py
    python scripts/validate_metadata.py --verbose
"""

import argparse
import json
import os
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEXTS_DIR = os.path.join(REPO_ROOT, "texts")

REQUIRED_FIELDS = [
    "text_id",
    "author",
    "title",
    "title_greek",
    "language",
    "edition",
    "source",
    "license",
    "text_file",
]

RECOMMENDED_FIELDS = [
    "author_greek",
    "tlg_author",
    "tlg_work",
    "character_count",
    "word_count",
    "section_count",
    "related_texts",
]

VALID_LANGUAGES = {"grc", "la", "en"}


def discover_all_works():
    """Find all work directories in the corpus."""
    works = {}
    for author_slug in sorted(os.listdir(TEXTS_DIR)):
        author_dir = os.path.join(TEXTS_DIR, author_slug)
        if not os.path.isdir(author_dir):
            continue
        for work_slug in sorted(os.listdir(author_dir)):
            work_dir = os.path.join(author_dir, work_slug)
            if not os.path.isdir(work_dir):
                continue
            text_id = f"{author_slug}.{work_slug}"
            works[text_id] = {
                "author": author_slug,
                "work": work_slug,
                "dir": work_dir,
                "has_text": os.path.isfile(os.path.join(work_dir, "text.md")),
                "has_metadata": os.path.isfile(os.path.join(work_dir, "metadata.json")),
            }
    return works


def validate_metadata(meta_path, text_id, work_info, all_text_ids, verbose=False):
    """Validate a single metadata.json file. Returns (errors, warnings)."""
    errors = []
    warnings = []

    # 1. Parse JSON
    try:
        with open(meta_path, "r", encoding="utf-8") as f:
            meta = json.load(f)
    except json.JSONDecodeError as e:
        errors.append(f"Invalid JSON: {e}")
        return errors, warnings
    except Exception as e:
        errors.append(f"Could not read file: {e}")
        return errors, warnings

    if not isinstance(meta, dict):
        errors.append(f"Top-level value must be an object, got {type(meta).__name__}")
        return errors, warnings

    # 2. Required fields
    for field in REQUIRED_FIELDS:
        if field not in meta:
            errors.append(f"Missing required field: '{field}'")
        elif not meta[field] and meta[field] != 0:
            errors.append(f"Required field '{field}' is empty")

    # 3. Recommended fields
    for field in RECOMMENDED_FIELDS:
        if field not in meta:
            warnings.append(f"Missing recommended field: '{field}'")

    # 4. text_id matches directory structure
    if "text_id" in meta:
        expected_id = text_id
        if meta["text_id"] != expected_id:
            errors.append(
                f"text_id mismatch: '{meta['text_id']}' in file vs expected '{expected_id}' from directory"
            )

    # 5. text_file resolves to an actual file
    if "text_file" in meta:
        text_file_path = os.path.join(work_info["dir"], meta["text_file"])
        if not os.path.isfile(text_file_path):
            errors.append(
                f"text_file '{meta['text_file']}' does not exist at {text_file_path}"
            )

    # 6. Cross-references valid
    if "related_texts" in meta:
        if not isinstance(meta["related_texts"], list):
            errors.append(f"'related_texts' must be an array, got {type(meta['related_texts']).__name__}")
        else:
            for ref in meta["related_texts"]:
                if not isinstance(ref, str):
                    errors.append(f"Invalid related_text entry (not a string): {ref}")
                elif ref not in all_text_ids:
                    errors.append(f"Cross-reference '{ref}' does not resolve to a known text")
                elif ref == text_id:
                    warnings.append(f"Cross-reference points to self: '{ref}'")

    # 7. Language validation
    if "language" in meta and meta["language"] not in VALID_LANGUAGES:
        warnings.append(f"Unusual language code: '{meta['language']}' (expected one of {VALID_LANGUAGES})")

    # 8. Numeric field validation
    for field in ["character_count", "word_count", "section_count"]:
        if field in meta:
            if not isinstance(meta[field], (int, float)):
                errors.append(f"'{field}' must be numeric, got {type(meta[field]).__name__}")
            elif meta[field] < 0:
                errors.append(f"'{field}' is negative: {meta[field]}")
            elif meta[field] == 0:
                warnings.append(f"'{field}' is zero — possibly missing data")

    if verbose:
        # Print all fields for inspection
        for key, val in meta.items():
            if key not in REQUIRED_FIELDS + RECOMMENDED_FIELDS:
                warnings.append(f"Extra field: '{key}'")

    return errors, warnings


def main():
    parser = argparse.ArgumentParser(
        description="Validate metadata.json files across the corpus."
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Show detailed output including warnings and per-file status",
    )
    args = parser.parse_args()

    works = discover_all_works()
    all_text_ids = set(works.keys())

    total_errors = 0
    total_warnings = 0
    files_checked = 0
    files_ok = 0

    # Check for orphan texts (text.md without metadata.json)
    orphans = [
        tid for tid, info in works.items()
        if info["has_text"] and not info["has_metadata"]
    ]

    # Check for metadata without text
    no_text = [
        tid for tid, info in works.items()
        if info["has_metadata"] and not info["has_text"]
    ]

    print("=== Metadata Validation Report ===\n")

    if orphans:
        print(f"Texts without metadata.json ({len(orphans)}):")
        for tid in orphans:
            print(f"  - {tid}")
        print(f"\n  Hint: Run 'python scripts/build_corpus_json.py --generate-metadata' to generate them.\n")

    if no_text:
        print(f"Metadata without text.md ({len(no_text)}):")
        for tid in no_text:
            print(f"  - {tid}")
        print()

    # Validate each metadata.json
    for text_id in sorted(works.keys()):
        info = works[text_id]
        if not info["has_metadata"]:
            continue

        meta_path = os.path.join(info["dir"], "metadata.json")
        errors, warnings = validate_metadata(
            meta_path, text_id, info, all_text_ids, verbose=args.verbose
        )

        files_checked += 1
        total_errors += len(errors)
        total_warnings += len(warnings)

        if errors or (warnings and args.verbose):
            status = "FAIL" if errors else "WARN"
            print(f"[{status}] {text_id}")
            for e in errors:
                print(f"  ERROR: {e}")
            if args.verbose:
                for w in warnings:
                    print(f"  WARN:  {w}")
        elif args.verbose:
            print(f"[ OK ] {text_id}")
            files_ok += 1
        else:
            files_ok += 1

    # Summary
    print(f"\n=== Summary ===")
    print(f"  Files checked:  {files_checked}")
    print(f"  Passed:         {files_ok}")
    print(f"  Errors:         {total_errors}")
    print(f"  Warnings:       {total_warnings}")
    print(f"  Orphan texts:   {len(orphans)} (text.md without metadata.json)")
    print(f"  Missing texts:  {len(no_text)} (metadata.json without text.md)")

    if total_errors > 0:
        print(f"\nValidation FAILED with {total_errors} error(s).")
        sys.exit(1)
    elif orphans:
        print(f"\nValidation PASSED with warnings (orphan texts found).")
        sys.exit(0)
    else:
        print(f"\nValidation PASSED.")
        sys.exit(0)


if __name__ == "__main__":
    main()
