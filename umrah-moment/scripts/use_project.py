#!/usr/bin/env python3
"""
Pilih projek aktif:  python3 scripts/use_project.py <slug>     (npm run use -- <slug>)
Projek: projects/<slug>/{project.tsx, project.config.json, photos.json}
Menjana src/active.ts (dibaca oleh enjin Remotion) dan fail ACTIVE (dibaca oleh skrip Python).
Projek baharu: salin projects/<contoh>/ ke projects/<slug>/ dan ubah slug dalam project.config.json.
"""
import json, os, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
slug = sys.argv[1]
d = os.path.join(ROOT, "projects", slug)
assert os.path.isdir(d), f"Tiada projek: {d}"
pj = os.path.join(d, "photos.json")
if not os.path.exists(pj):
    json.dump({}, open(pj, "w"))
open(os.path.join(ROOT, "src", "active.ts"), "w").write(f"""// DIJANA oleh scripts/use_project.py — jangan sunting. Projek aktif: {slug}
export * from '../projects/{slug}/project';
export {{ default as config }} from '../projects/{slug}/project.config.json';
export {{ default as photos }} from '../projects/{slug}/photos.json';
export const SLUG = '{slug}';
""")
open(os.path.join(ROOT, "ACTIVE"), "w").write(slug + "\n")
print("Projek aktif:", slug, "|", json.load(open(os.path.join(d, "project.config.json"))).get("group"))
