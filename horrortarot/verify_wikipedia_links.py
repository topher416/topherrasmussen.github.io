#!/usr/bin/env python3
"""
Script to verify and fix Wikipedia URLs for movies in movies.json
"""

import json
import urllib.parse
import urllib.request
import time
from typing import Optional, Dict, List

def check_url_exists(url: str) -> bool:
    """Check if a URL returns a 200 status code"""
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            # Wikipedia redirects are handled automatically
            # Check if we got a valid page (not a search results page)
            final_url = response.geturl()
            if 'Special:Search' in final_url or 'index.php' in final_url:
                return False
            return response.status == 200
    except Exception as e:
        print(f"  Error checking {url}: {str(e)}")
        return False

def url_encode_title(title: str) -> str:
    """Properly encode title for Wikipedia URL"""
    # Replace spaces with underscores (Wikipedia style)
    # Then URL encode special characters
    return urllib.parse.quote(title.replace(' ', '_'))

def find_wikipedia_url(title: str, year: int) -> Optional[str]:
    """
    Try different Wikipedia URL patterns to find a working one
    Returns the first working URL or None
    """
    base_url = "https://en.wikipedia.org/wiki/"

    # Pattern 1: Title only (most common)
    patterns = [
        title,
        f"{title} (film)",
        f"{title} ({year} film)",
        f"{title} ({year})",
    ]

    print(f"\nChecking: {title} ({year})")

    for pattern in patterns:
        encoded_pattern = url_encode_title(pattern)
        url = f"{base_url}{encoded_pattern}"
        print(f"  Trying: {url}")

        if check_url_exists(url):
            print(f"  ✓ Found working URL!")
            return url

        # Small delay to be respectful to Wikipedia's servers
        time.sleep(0.5)

    print(f"  ✗ No working Wikipedia URL found")
    return None

def main():
    movies_path = "/Users/topher416/Desktop/Manual Library/self mgmt/Website/topherrasmussen.github.io/horrortarot/movies.json"

    print("Loading movies.json...")
    with open(movies_path, 'r') as f:
        movies = json.load(f)

    print(f"Found {len(movies)} movies to check\n")
    print("=" * 80)

    stats = {
        'total': len(movies),
        'found': 0,
        'not_found': 0,
        'not_found_list': []
    }

    # Process each movie
    for i, movie in enumerate(movies, 1):
        title = movie['title']
        year = movie['year']

        print(f"\n[{i}/{len(movies)}] Processing: {title} ({year})")

        wikipedia_url = find_wikipedia_url(title, year)

        if wikipedia_url:
            movie['wikipediaUrl'] = wikipedia_url
            stats['found'] += 1
        else:
            movie['wikipediaUrl'] = None
            stats['not_found'] += 1
            stats['not_found_list'].append(f"{title} ({year})")

        # Save progress every 10 movies
        if i % 10 == 0:
            print(f"\n💾 Saving progress... ({i}/{len(movies)} completed)")
            with open(movies_path, 'w') as f:
                json.dump(movies, f, indent=2)

    # Save final results
    print("\n" + "=" * 80)
    print("\n💾 Saving final results...")
    with open(movies_path, 'w') as f:
        json.dump(movies, f, indent=2)

    # Print summary
    print("\n" + "=" * 80)
    print("\nSUMMARY")
    print("=" * 80)
    print(f"Total movies checked: {stats['total']}")
    print(f"Working URLs found: {stats['found']}")
    print(f"URLs not found: {stats['not_found']}")

    if stats['not_found_list']:
        print(f"\nMovies without Wikipedia pages:")
        for movie_name in stats['not_found_list']:
            print(f"  - {movie_name}")

    print("\n✓ movies.json has been updated!")
    print("\nNext: Copy to public/movies.json")

if __name__ == "__main__":
    main()
