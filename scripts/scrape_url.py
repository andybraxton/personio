#!/usr/bin/env python3
"""Fetch a URL using requests and print JSON to stdout.
Called by the Next.js url-fetcher as a subprocess to bypass Node TLS fingerprinting."""
import json
import sys
import subprocess

try:
    import requests
except ImportError:
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'requests', '-q'])
    import requests

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
        session = requests.Session()
        session.headers.update({"User-Agent": UA})
        resp = session.get(url, timeout=15, allow_redirects=True)
        print(json.dumps({
            "status": resp.status_code,
            "html": resp.text,
            "url": str(resp.url),
        }))
    except Exception as exc:
        print(json.dumps({"status": 0, "html": "", "url": url, "error": str(exc)}))

if __name__ == "__main__":
    main()
