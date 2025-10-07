#!/usr/bin/env python3
"""
Script to add Wikipedia URLs to movies.json
Uses curl to verify URLs work correctly
"""

import json
import urllib.parse
import subprocess
import time

def url_encode_title(title: str) -> str:
    """Properly encode title for Wikipedia URL"""
    return urllib.parse.quote(title.replace(' ', '_'))

def check_url_with_curl(url: str) -> bool:
    """Use curl to check if URL exists and returns valid page"""
    try:
        # Use curl with follow redirects, and check if we get a 200 status
        result = subprocess.run(
            ['curl', '-s', '-o', '/dev/null', '-w', '%{http_code}:%{url_effective}', '-L', url],
            capture_output=True,
            text=True,
            timeout=15
        )

        if result.returncode == 0:
            output = result.stdout.strip()
            if ':' in output:
                status_code, final_url = output.split(':', 1)
                # Check if we got 200 and didn't redirect to search page
                if status_code == '200' and 'Special:Search' not in final_url:
                    return True
        return False
    except Exception as e:
        print(f"    Error checking URL: {str(e)}")
        return False

def find_wikipedia_url(title: str, year: int) -> str:
    """Try different Wikipedia URL patterns to find working one"""
    base_url = "https://en.wikipedia.org/wiki/"

    # Try different patterns in order of likelihood
    patterns = [
        title,  # Just title
        f"{title} (film)",  # Title (film)
        f"{title} ({year} film)",  # Title (year film)
        f"{title} ({year})",  # Title (year)
    ]

    print(f"\n  Checking URL patterns:")

    for pattern in patterns:
        encoded_pattern = url_encode_title(pattern)
        url = f"{base_url}{encoded_pattern}"
        print(f"    Trying: {url}")

        if check_url_with_curl(url):
            print(f"    ✓ Found working URL!")
            return url

        time.sleep(0.3)  # Small delay between requests

    # If nothing works, return the default (title only)
    print(f"    Using default pattern (title only)")
    return f"{base_url}{url_encode_title(title)}"

def main():
    movies_path = "/Users/topher416/Desktop/Manual Library/self mgmt/Website/topherrasmussen.github.io/horrortarot/movies.json"

    print("Loading movies.json...")
    with open(movies_path, 'r') as f:
        movies = json.load(f)

    print(f"Found {len(movies)} movies to process\n")
    print("=" * 80)

    stats = {
        'total': len(movies),
        'verified': 0,
        'default': 0,
        'default_list': []
    }

    for i, movie in enumerate(movies, 1):
        title = movie['title']
        year = movie['year']

        print(f"\n[{i}/{len(movies)}] {title} ({year})")

        # Find and set Wikipedia URL
        wikipedia_url = find_wikipedia_url(title, year)
        movie['wikipediaUrl'] = wikipedia_url

        # Track stats
        base_url = "https://en.wikipedia.org/wiki/"
        expected_default = f"{base_url}{url_encode_title(title)}"
        if wikipedia_url == expected_default:
            # Check if this was actually verified or just default
            if check_url_with_curl(wikipedia_url):
                stats['verified'] += 1
            else:
                stats['default'] += 1
                stats['default_list'].append(f"{title} ({year})")
        else:
            stats['verified'] += 1

        # Save progress every 10 movies
        if i % 10 == 0:
            print(f"\n  💾 Saving progress... ({i}/{len(movies)} completed)")
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
    print(f"Total movies: {stats['total']}")
    print(f"Verified working URLs: {stats['verified']}")
    print(f"Default URLs (not verified): {stats['default']}")

    if stats['default_list']:
        print(f"\nMovies using default URL (may need manual verification):")
        for movie_name in stats['default_list']:
            print(f"  - {movie_name}")

    print("\n✓ movies.json has been updated with wikipediaUrl field!")

if __name__ == "__main__":
    main()
