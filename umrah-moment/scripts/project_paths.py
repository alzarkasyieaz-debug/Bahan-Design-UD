"""Laluan projek aktif untuk skrip Python (lihat scripts/use_project.py)."""
import json, os
ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
SLUG = open(os.path.join(ROOT, "ACTIVE")).read().strip()
PROJECT_DIR = os.path.join(ROOT, "projects", SLUG)
CONFIG = json.load(open(os.path.join(PROJECT_DIR, "project.config.json")))
IMG_DIR = os.path.join(ROOT, "public", "img", SLUG)
AUDIO_DIR = os.path.join(ROOT, "public", "audio", SLUG)
ALBUM_DIR = os.path.join(ROOT, "album", SLUG)
