#!/usr/bin/env python3
"""Fetch Greek texts from Perseus Digital Library GitHub repo and convert to Markdown."""

import os
import re
import sys
import time
import urllib.request
import xml.etree.ElementTree as ET

BASE_URL = "https://raw.githubusercontent.com/PerseusDL/canonical-greekLit/master/data"

# TLG mappings following Thrasyllus tetralogies
PLATO_WORKS = {
    "tlg001": ("euthyphro", "Εὐθύφρων", "Euthyphro"),
    "tlg002": ("apology", "Ἀπολογία Σωκράτους", "Apology of Socrates"),
    "tlg003": ("crito", "Κρίτων", "Crito"),
    "tlg004": ("phaedo", "Φαίδων", "Phaedo"),
    "tlg005": ("cratylus", "Κρατύλος", "Cratylus"),
    "tlg006": ("theaetetus", "Θεαίτητος", "Theaetetus"),
    "tlg007": ("sophist", "Σοφιστής", "Sophist"),
    "tlg008": ("statesman", "Πολιτικός", "Statesman"),
    "tlg009": ("parmenides", "Παρμενίδης", "Parmenides"),
    "tlg010": ("philebus", "Φίληβος", "Philebus"),
    "tlg011": ("symposium", "Συμπόσιον", "Symposium"),
    "tlg012": ("phaedrus", "Φαῖδρος", "Phaedrus"),
    "tlg013": ("alcibiades-i", "Ἀλκιβιάδης Αʹ", "Alcibiades I"),
    "tlg018": ("charmides", "Χαρμίδης", "Charmides"),
    "tlg019": ("laches", "Λάχης", "Laches"),
    "tlg020": ("lysis", "Λύσις", "Lysis"),
    "tlg021": ("euthydemus", "Εὐθύδημος", "Euthydemus"),
    "tlg022": ("protagoras", "Πρωταγόρας", "Protagoras"),
    "tlg023": ("gorgias", "Γοργίας", "Gorgias"),
    "tlg024": ("meno", "Μένων", "Meno"),
    "tlg025": ("hippias-major", "Ἱππίας μείζων", "Hippias Major"),
    "tlg026": ("hippias-minor", "Ἱππίας ἐλάττων", "Hippias Minor"),
    "tlg027": ("ion", "Ἴων", "Ion"),
    "tlg028": ("menexenus", "Μενέξενος", "Menexenus"),
    "tlg029": ("clitophon", "Κλειτοφῶν", "Clitophon"),
    "tlg030": ("republic", "Πολιτεία", "Republic"),
    "tlg031": ("timaeus", "Τίμαιος", "Timaeus"),
    "tlg032": ("critias", "Κριτίας", "Critias"),
}

# Xenophon TLG 0032
XENOPHON_WORKS = {
    "tlg002": ("memorabilia", "Ἀπομνημονεύματα", "Memorabilia"),
    "tlg011": ("apology", "Ἀπολογία Σωκράτους", "Apology of Socrates"),
    "tlg004": ("symposium", "Συμπόσιον", "Symposium"),
    "tlg003": ("oeconomicus", "Οἰκονομικός", "Oeconomicus"),
}

# Aristophanes TLG 0019
ARISTOPHANES_WORKS = {
    "tlg003": ("clouds", "Νεφέλαι", "The Clouds"),
}

TEXTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "texts")

NS = {"tei": "http://www.tei-c.org/ns/1.0"}


def fetch_url(url, retries=3):
    """Fetch URL with retries and exponential backoff."""
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "socrates-source/1.0"})
            with urllib.request.urlopen(req, timeout=30) as resp:
                return resp.read().decode("utf-8")
        except Exception as e:
            if attempt < retries - 1:
                wait = 2 ** (attempt + 1)
                print(f"  Retry {attempt+1} after {wait}s: {e}")
                time.sleep(wait)
            else:
                print(f"  FAILED: {e}")
                return None


def extract_text_from_tei(xml_content):
    """Extract Greek text from TEI XML, preserving section structure."""
    # Remove XML declaration and namespace issues
    xml_content = re.sub(r'<\?xml[^?]*\?>', '', xml_content)

    # Parse the XML
    try:
        root = ET.fromstring(xml_content)
    except ET.ParseError as e:
        print(f"  XML parse error: {e}")
        # Fallback: extract text with regex
        return extract_text_regex(xml_content)

    # Find the body element
    body = root.find(".//tei:body", NS)
    if body is None:
        body = root.find(".//{http://www.tei-c.org/ns/1.0}body")
    if body is None:
        # Try without namespace
        body = root.find(".//body")
    if body is None:
        print("  No body found, using regex fallback")
        return extract_text_regex(xml_content)

    sections = []
    current_section = None
    current_text = []

    def get_text_recursive(elem):
        """Get all text content from an element recursively."""
        parts = []
        if elem.text:
            parts.append(elem.text)
        for child in elem:
            # Check for milestone elements that indicate sections
            if child.tag.endswith("}milestone") or child.tag == "milestone":
                unit = child.get("unit", "")
                n = child.get("n", "")
                if unit in ("section", "page", "stephpage", "card"):
                    parts.append(f"\n\n### {n}\n\n")
            else:
                parts.extend(get_text_recursive(child))
            if child.tail:
                parts.append(child.tail)
        return parts

    # Also look for div structures with section info
    def process_element(elem, depth=0):
        """Process an element and its children, extracting sections."""
        tag = elem.tag.split("}")[-1] if "}" in elem.tag else elem.tag

        if tag == "milestone":
            unit = elem.get("unit", "")
            n = elem.get("n", "")
            if unit in ("section", "page", "stephpage", "card"):
                sections.append(("section", n))

        if tag == "div":
            div_type = elem.get("type", "")
            n = elem.get("n", "")
            subtype = elem.get("subtype", "")
            if div_type in ("section", "chapter") or subtype in ("section", "chapter"):
                if n:
                    sections.append(("div", n))

        # Get direct text
        if elem.text and elem.text.strip():
            sections.append(("text", elem.text.strip()))

        for child in elem:
            process_element(child, depth + 1)
            if child.tail and child.tail.strip():
                sections.append(("text", child.tail.strip()))

    process_element(body)

    # Build output
    output_parts = []
    for stype, content in sections:
        if stype in ("section", "div"):
            output_parts.append(f"\n\n### {content}\n\n")
        elif stype == "text":
            output_parts.append(content + " ")

    result = "".join(output_parts).strip()

    # Clean up whitespace
    result = re.sub(r'\n{3,}', '\n\n', result)
    result = re.sub(r' +', ' ', result)

    return result


def extract_text_regex(xml_content):
    """Fallback: extract Greek text using regex."""
    # Remove XML tags but preserve milestone info
    text = xml_content

    # Extract section markers
    text = re.sub(
        r'<milestone[^>]*unit="(section|page|stephpage|card)"[^>]*n="([^"]*)"[^>]*/>',
        r'\n\n### \2\n\n',
        text
    )
    text = re.sub(
        r'<milestone[^>]*n="([^"]*)"[^>]*unit="(section|page|stephpage|card)"[^>]*/>',
        r'\n\n### \1\n\n',
        text
    )

    # Remove all remaining XML tags
    text = re.sub(r'<[^>]+>', '', text)

    # Clean up entities
    text = text.replace('&amp;', '&')
    text = text.replace('&lt;', '<')
    text = text.replace('&gt;', '>')
    text = text.replace('&quot;', '"')

    # Clean up whitespace
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r' +', ' ', text)

    return text.strip()


def format_text_md(greek_title, english_title, author, source_info, text_content):
    """Format the extracted text as a Markdown file."""
    return f"""# {greek_title}
## {english_title} — {author}

**{source_info}**

---

{text_content}
"""


def process_work(author_tlg, work_tlg, dir_name, greek_title, english_title, author_name, author_dir):
    """Fetch and process a single work."""
    # Try different file name patterns
    patterns = [
        f"{author_tlg}.{work_tlg}.perseus-grc2.xml",
        f"{author_tlg}.{work_tlg}.perseus-grc1.xml",
    ]

    xml_content = None
    used_pattern = None
    for pattern in patterns:
        url = f"{BASE_URL}/{author_tlg}/{work_tlg}/{pattern}"
        print(f"  Trying: {url}")
        xml_content = fetch_url(url)
        if xml_content:
            used_pattern = pattern
            break

    if not xml_content:
        print(f"  SKIPPED: Could not fetch {english_title}")
        return False

    # Extract text
    text_content = extract_text_from_tei(xml_content)

    if not text_content or len(text_content) < 100:
        print(f"  WARNING: Very short text extracted for {english_title} ({len(text_content)} chars)")
        # Try regex fallback
        text_content = extract_text_regex(xml_content)

    if not text_content or len(text_content) < 50:
        print(f"  SKIPPED: No usable text extracted for {english_title}")
        return False

    # Determine source info
    source_info = f"Source: Burnet, OCT 1903 | Perseus Digital Library" if author_name == "Plato" else \
                  f"Source: Marchant, OCT | Perseus Digital Library" if author_name == "Xenophon" else \
                  f"Source: Hall & Geldart, OCT | Perseus Digital Library"

    # Format and save
    md_content = format_text_md(greek_title, english_title, author_name, source_info, text_content)

    out_dir = os.path.join(TEXTS_DIR, author_dir, dir_name)
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "text.md")

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(md_content)

    char_count = len(text_content)
    word_count = len(text_content.split())
    print(f"  OK: {english_title} — {char_count:,} chars, {word_count:,} words → {out_path}")
    return True


def main():
    total = 0
    success = 0

    print("=== Fetching Plato's Dialogues ===")
    for work_tlg, (dir_name, greek, english) in sorted(PLATO_WORKS.items()):
        total += 1
        print(f"\n[{total}] {english} ({greek})")
        if process_work("tlg0059", work_tlg, dir_name, greek, english, "Plato", "plato"):
            success += 1
        time.sleep(0.5)  # Be polite to GitHub

    print("\n=== Fetching Xenophon's Socratic Works ===")
    for work_tlg, (dir_name, greek, english) in sorted(XENOPHON_WORKS.items()):
        total += 1
        print(f"\n[{total}] {english} ({greek})")
        if process_work("tlg0032", work_tlg, dir_name, greek, english, "Xenophon", "xenophon"):
            success += 1
        time.sleep(0.5)

    print("\n=== Fetching Aristophanes ===")
    for work_tlg, (dir_name, greek, english) in sorted(ARISTOPHANES_WORKS.items()):
        total += 1
        print(f"\n[{total}] {english} ({greek})")
        if process_work("tlg0019", work_tlg, dir_name, greek, english, "Aristophanes", "aristophanes"):
            success += 1
        time.sleep(0.5)

    print(f"\n=== Done: {success}/{total} texts fetched successfully ===")


if __name__ == "__main__":
    main()
