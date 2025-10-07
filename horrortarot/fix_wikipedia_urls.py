#!/usr/bin/env python3
"""
Fix specific Wikipedia URLs that need corrections
"""

import json

def main():
    movies_path = "/Users/topher416/Desktop/Manual Library/self mgmt/Website/topherrasmussen.github.io/horrortarot/movies.json"

    print("Loading movies.json...")
    with open(movies_path, 'r') as f:
        movies = json.load(f)

    # Dictionary of corrections based on web search results
    corrections = {
        "Kairo (Pulse)": "https://en.wikipedia.org/wiki/Pulse_(2001_film)",
        "Ringu": "https://en.wikipedia.org/wiki/Ring_(film)",
    }

    print("\nApplying corrections...")
    changes_made = 0

    for movie in movies:
        if movie['title'] in corrections:
            old_url = movie['wikipediaUrl']
            new_url = corrections[movie['title']]
            movie['wikipediaUrl'] = new_url
            print(f"\n✓ Fixed: {movie['title']} ({movie['year']})")
            print(f"  Old: {old_url}")
            print(f"  New: {new_url}")
            changes_made += 1

    # Save the updated file
    print(f"\n💾 Saving changes...")
    with open(movies_path, 'w') as f:
        json.dump(movies, f, indent=2)

    print(f"\n✓ Complete! Made {changes_made} corrections.")

if __name__ == "__main__":
    main()
