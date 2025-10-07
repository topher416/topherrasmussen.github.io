#!/usr/bin/env python3
"""
Generate a detailed report of Wikipedia URL verification
"""

import json
import subprocess
import time

def check_url_status(url: str) -> tuple:
    """Check URL and return (status_code, final_url)"""
    try:
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
                return (status_code, final_url)
        return ('ERROR', url)
    except Exception as e:
        return ('ERROR', url)

def main():
    movies_path = "/Users/topher416/Desktop/Manual Library/self mgmt/Website/topherrasmussen.github.io/horrortarot/movies.json"

    print("Loading movies.json...")
    with open(movies_path, 'r') as f:
        movies = json.load(f)

    print(f"Verifying Wikipedia URLs for {len(movies)} movies...\n")
    print("=" * 100)

    stats = {
        'total': len(movies),
        'verified_working': 0,
        'redirected': 0,
        'not_found': 0,
        'error': 0
    }

    issues = []
    redirects = []

    for i, movie in enumerate(movies, 1):
        title = movie['title']
        year = movie['year']
        url = movie.get('wikipediaUrl', 'N/A')

        print(f"\r[{i}/{len(movies)}] Checking: {title[:50]:<50}", end='', flush=True)

        if url == 'N/A':
            stats['not_found'] += 1
            issues.append(f"{title} ({year}) - No URL assigned")
            continue

        status_code, final_url = check_url_status(url)

        if status_code == '200':
            if final_url != url and 'Special:Search' not in final_url:
                stats['redirected'] += 1
                redirects.append(f"{title} ({year}): {url} -> {final_url}")
            else:
                stats['verified_working'] += 1
        elif status_code == '404':
            stats['not_found'] += 1
            issues.append(f"{title} ({year}) - 404 Not Found: {url}")
        else:
            stats['error'] += 1
            issues.append(f"{title} ({year}) - Error ({status_code}): {url}")

        time.sleep(0.2)  # Be respectful to Wikipedia servers

    print("\n" + "=" * 100)
    print("\nFINAL REPORT")
    print("=" * 100)
    print(f"\nTotal movies checked: {stats['total']}")
    print(f"✓ Working URLs: {stats['verified_working']}")
    print(f"↪ Redirected URLs: {stats['redirected']}")
    print(f"✗ Not found (404): {stats['not_found']}")
    print(f"⚠ Errors: {stats['error']}")

    if redirects:
        print(f"\n\nREDIRECTS ({len(redirects)}):")
        print("-" * 100)
        for redirect in redirects:
            print(f"  {redirect}")

    if issues:
        print(f"\n\nISSUES ({len(issues)}):")
        print("-" * 100)
        for issue in issues:
            print(f"  {issue}")
    else:
        print("\n\n✓ No issues found! All Wikipedia URLs are working correctly.")

    print("\n" + "=" * 100)
    print("\nSUMMARY:")
    print(f"  - Total movies: {stats['total']}")
    print(f"  - Successfully verified: {stats['verified_working'] + stats['redirected']}/{stats['total']}")
    print(f"  - Issues requiring attention: {stats['not_found'] + stats['error']}")
    print("\n✓ Report complete!")

if __name__ == "__main__":
    main()
