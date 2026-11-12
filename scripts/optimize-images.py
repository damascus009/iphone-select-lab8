"""Rebuild responsive WebP derivatives; keep originals for future edits (Pillow)."""
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parent.parent/'assets/images'
for source,stem,widths,quality in [('hero_bg.webp','hero',(960,1672),72),('iphone18-detail.jpg','iphone18-detail',(400,748),76),('iphone18-hero.jpg','iphone18-hero',(400,800,1200),76),('iPhone.png','viewer-poster',(480,960,1672),76)]:
    with Image.open(root/source) as image:
        for width in widths:
            resized=image.resize((width,round(image.height*width/image.width)),Image.Resampling.LANCZOS)
            target=root/f'{stem}-{width}-v1.webp'
            resized.save(target,'WEBP',quality=quality,method=6)
            print(target.name,target.stat().st_size)
