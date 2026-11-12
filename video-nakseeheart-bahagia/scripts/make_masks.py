"""Jana matte penceramah bagi setiap bingkai (u2net_human_seg via rembg).
Guna: python3 scripts/make_masks.py <WORK_DIR> <worker_id> <n_workers>"""
import sys, glob, os
from rembg import remove, new_session
from PIL import Image

work, wid, n = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
s = new_session("u2net_human_seg")
for f in sorted(glob.glob(os.path.join(work, "rgb", "*.jpg")))[wid::n]:
    out = os.path.join(work, "masks", os.path.basename(f).replace(".jpg", ".png"))
    if not os.path.exists(out):
        remove(Image.open(f), session=s, only_mask=True).save(out)
