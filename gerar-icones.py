"""
Gera os ícones PWA do Altas Horas (icon-192.png e icon-512.png).
Requer: pip install Pillow
Rodar: python gerar-icones.py
"""
from PIL import Image, ImageDraw, ImageFont
import os

SIZES = [192, 512]
BG_COLOR = (217, 31, 38)       # #D91F26
TEXT_COLOR = (245, 197, 24)    # #F5C518

def make_icon(size):
    img = Image.new("RGB", (size, size), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Tenta carregar fonte bold; cai em default se não tiver
    font_size = int(size * 0.42)
    try:
        font = ImageFont.truetype("arialbd.ttf", font_size)
    except Exception:
        try:
            font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", font_size)
        except Exception:
            font = ImageFont.load_default()

    text = "AH"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (size - tw) // 2
    y = (size - th) // 2

    draw.text((x, y), text, fill=TEXT_COLOR, font=font)

    # Borda arredondada via máscara
    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    radius = size // 5
    mask_draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    img.putalpha(mask)

    out = img.convert("RGBA")
    return out

os.makedirs("public/icons", exist_ok=True)
for s in SIZES:
    icon = make_icon(s)
    path = f"public/icons/icon-{s}.png"
    icon.save(path)
    print(f"Gerado: {path}")

print("Pronto! Ícones em public/icons/")
