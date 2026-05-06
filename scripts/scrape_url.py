#!/usr/bin/env python3
"""Fetch a URL using urllib (stdlib only — no dependencies) and print JSON to stdout."""
import json
import sys
import urllib.request
import urllib.error

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No URL provided"}))
        sys.exit(1)

    url = sys.argv[1]
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode("utf-8", errors="replace")
            print(json.dumps({"status": resp.status, "html": html, "url": resp.url}))
    except urllib.error.HTTPError as exc:
        print(json.dumps({"status": exc.code, "html": "", "url": url, "error": str(exc)}))
    except Exception as exc:
        print(json.dumps({"status": 0, "html": "", "url": url, "error": str(exc)}))

if __name__ == "__main__":
    main()
