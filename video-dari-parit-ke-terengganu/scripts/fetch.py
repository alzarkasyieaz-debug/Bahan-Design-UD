#!/usr/bin/env python3
"""Muat turun bahan asal daripada folder Google Drive program (dikongsi melalui pautan)
ke build/raw/ berdasarkan assets/manifest.tsv (ID<TAB>nama fail)."""
import os, subprocess
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
RAW = os.path.join(ROOT, "build", "raw")


def get(row):
    fid, name = row
    out = os.path.join(RAW, name)
    if os.path.exists(out) and os.path.getsize(out) > 0:
        return name, "ada"
    url = f"https://drive.usercontent.google.com/download?id={fid}&export=download&confirm=t"
    r = subprocess.run(["curl", "-sL", "--retry", "3", "-o", out, url])
    return name, "ok" if r.returncode == 0 else "GAGAL"


if __name__ == "__main__":
    os.makedirs(RAW, exist_ok=True)
    rows = [l.rstrip("\n").split("\t") for l in open(os.path.join(ROOT, "assets", "manifest.tsv")) if l.strip()]
    with ThreadPoolExecutor(6) as ex:
        for name, st in ex.map(get, rows):
            print(st, name)
