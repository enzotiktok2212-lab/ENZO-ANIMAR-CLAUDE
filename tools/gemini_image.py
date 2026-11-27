#!/usr/bin/env python3
"""Generate one image with the Gemini API.
usage: gemini_image.py OUT.png "prompt" [--ratio 9:16] [--model M] [--ref img.png ...]
The API key is read from $GEMINI_API_KEY or from the file in $GEMINI_KEY_FILE."""
import argparse, base64, json, os, sys, urllib.request
p = argparse.ArgumentParser()
p.add_argument("out"); p.add_argument("prompt")
p.add_argument("--ratio", default="9:16"); p.add_argument("--model", default="gemini-3-pro-image")
p.add_argument("--ref", nargs="*", default=[])
a = p.parse_args()
key = os.environ.get("GEMINI_API_KEY") or open(os.environ["GEMINI_KEY_FILE"]).read().strip()
parts = []
for r in a.ref:
    parts.append({"inline_data": {"mime_type": "image/png", "data": base64.b64encode(open(r, "rb").read()).decode()}})
parts.append({"text": a.prompt})
body = {"contents": [{"parts": parts}],
        "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": a.ratio}}}
req = urllib.request.Request(
    f"https://generativelanguage.googleapis.com/v1beta/models/{a.model}:generateContent",
    data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": key})
try:
    d = json.load(urllib.request.urlopen(req, timeout=300))
except urllib.error.HTTPError as e:
    sys.exit(f"HTTP {e.code}: {e.read().decode()[:500]}")
for c in d.get("candidates", []):
    for part in c.get("content", {}).get("parts", []):
        blob = part.get("inline_data") or part.get("inlineData")
        if blob:
            open(a.out, "wb").write(base64.b64decode(blob["data"])); print(a.out); sys.exit(0)
sys.exit("no image: " + json.dumps(d)[:500])
