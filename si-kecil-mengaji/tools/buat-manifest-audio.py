#!/usr/bin/env python3
"""Jana audio/manifest.json daripada fail .mp3 yang ada dalam folder audio/.

Jalankan semula setiap kali rakaman baharu ditambah:
    python3 tools/buat-manifest-audio.py
"""
import json
from pathlib import Path

root = Path(__file__).resolve().parent.parent / "audio"
files = sorted(p.relative_to(root).as_posix() for p in root.rglob("*.mp3"))
(root / "manifest.json").write_text(json.dumps(files, indent=2, ensure_ascii=False) + "\n")
print(f"{len(files)} fail audio disenaraikan dalam {root / 'manifest.json'}")
