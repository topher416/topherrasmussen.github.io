#!/usr/bin/env python3
"""Regenerate RSS feed from journal.json and catalog.json.

Usage:
    python3 scripts/generate_feed.py
"""

import datetime
import json
import os
import sys


TIMEZONE_OFFSET = "-0600"  # CST — use -0600 for simplicity as requested
BASE_URL = "https://topherrasmussen.com"
SITE_URL = BASE_URL + "/"
FEED_URL = BASE_URL + "/feed.xml"
FEED_TITLE = "Topher Rasmussen — Writing & Journal"
FEED_DESCRIPTION = (
    "Essays on psychoanalysis, AI, authorship, and the gap between "
    "understanding yourself and actually living."
)
MAX_ITEMS = 50
DESCRIPTION_MAX = 250


def format_rfc822(dt):
    """Format a datetime as RFC 822 / RSS pubDate style: '2026-05-03 22:15:00 -0600'."""
    return dt.strftime("%Y-%m-%d %H:%M:%S ") + TIMEZONE_OFFSET


def escape_xml(text):
    """Escape special XML characters (& < > "). Do not escape single quotes."""
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def make_description(text, max_len=DESCRIPTION_MAX):
    """Truncate text to max_len for use as RSS description."""
    text = text.strip()
    if len(text) <= max_len:
        return text
    return text[:max_len]


def journal_to_items(entries):
    """Convert journal entries to RSS item dicts."""
    items = []
    for entry in entries:
        slug = entry.get("slug", "")
        title = entry.get("title", "")
        body = entry.get("body", [])
        first_para = body[0] if body else ""
        dt_str = entry.get("datetime", "")

        try:
            dt = datetime.datetime.fromisoformat(dt_str)
        except (ValueError, TypeError):
            continue

        items.append({
            "title": title,
            "link": f"{BASE_URL}/journal.html#{slug}",
            "guid": f"journal-{slug}",
            "pubDate": format_rfc822(dt),
            "description": make_description(first_para),
            "category": "Journal",
            "sort_key": dt,
        })
    return items


def writing_to_items(entries):
    """Convert catalog writing entries to RSS item dicts."""
    items = []
    for entry in entries:
        if entry.get("category") != "writing":
            continue

        title = entry.get("title", "")
        description = entry.get("description", "")
        raw_url = entry.get("url") or ""
        entry_id = entry.get("id", "")
        year = entry.get("year", 0)

        # Resolve relative URLs
        if raw_url.startswith("/"):
            link = BASE_URL + raw_url
        elif raw_url:
            link = raw_url
        else:
            link = SITE_URL

        # Use January 1 of the year as pubDate
        try:
            dt = datetime.datetime(int(year), 1, 1, 0, 0, 0)
        except (ValueError, TypeError):
            continue

        items.append({
            "title": title,
            "link": link,
            "guid": f"writing-{entry_id}",
            "pubDate": format_rfc822(dt),
            "description": make_description(description),
            "category": "Essay",
            "sort_key": dt,
        })
    return items


def build_feed(items):
    """Build RSS 2.0 XML string from item dicts."""
    now = datetime.datetime.now()

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
        "<channel>",
        f"  <title>{escape_xml(FEED_TITLE)}</title>",
        f"  <link>{escape_xml(SITE_URL)}</link>",
        f"  <description>{escape_xml(FEED_DESCRIPTION)}</description>",
        f"  <language>en-us</language>",
        f'  <atom:link href="{escape_xml(FEED_URL)}" rel="self" type="application/rss+xml"/>',
        f"  <lastBuildDate>{format_rfc822(now)}</lastBuildDate>",
    ]

    for item in items:
        lines.append("  <item>")
        lines.append(f"    <title>{escape_xml(item['title'])}</title>")
        lines.append(f"    <link>{escape_xml(item['link'])}</link>")
        lines.append(f"    <guid>{escape_xml(item['guid'])}</guid>")
        lines.append(f"    <pubDate>{item['pubDate']}</pubDate>")
        lines.append(f"    <description>{escape_xml(item['description'])}</description>")
        lines.append(f"    <category>{item['category']}</category>")
        lines.append("  </item>")

    lines.append("</channel>")
    lines.append("</rss>")
    return "\n".join(lines) + "\n"


def main():
    repo_root = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.dirname(repo_root)

    journal_path = os.path.join(repo_root, "journal.json")
    catalog_path = os.path.join(repo_root, "catalog.json")
    feed_path = os.path.join(repo_root, "feed.xml")

    # Read journal entries
    with open(journal_path, "r", encoding="utf-8") as f:
        journal_entries = json.load(f)

    # Read catalog entries
    with open(catalog_path, "r", encoding="utf-8") as f:
        catalog_entries = json.load(f)

    # Convert to RSS items
    all_items = []
    all_items.extend(journal_to_items(journal_entries))
    all_items.extend(writing_to_items(catalog_entries))

    # Sort newest-first, take top 50
    all_items.sort(key=lambda x: x["sort_key"], reverse=True)
    all_items = all_items[:MAX_ITEMS]

    # Build and write feed
    feed_xml = build_feed(all_items)
    with open(feed_path, "w", encoding="utf-8") as f:
        f.write(feed_xml)

    print(f"Generated feed.xml with {len(all_items)} items")


if __name__ == "__main__":
    main()
