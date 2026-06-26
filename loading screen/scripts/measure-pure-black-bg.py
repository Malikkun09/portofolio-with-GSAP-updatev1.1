#!/usr/bin/env python3
"""
Objective pixel measurement of the loading screen background.

Samples corner + edge + center-band pixels from the loading-pure-black-mid.png
screenshot and reports exact RGB values to determine if the background is
PURE BLACK (#000000) vs dark charcoal (#050505) or any other near-black color.
"""
from PIL import Image
import json
import sys

IMG_PATH = "/home/z/my-project/download/loading-pure-black-mid.png"


def sample(img: Image.Image):
    w, h = img.size
    rgb = img.convert("RGB")

    # Build a sample plan: (label, x, y)
    samples = [
        # Corners (offset 1px to avoid any 0-based edge rounding)
        ("top_left_corner",     1,         1),
        ("top_right_corner",    w - 2,     1),
        ("bottom_left_corner",  1,         h - 2),
        ("bottom_right_corner", w - 2,     h - 2),
        # Edge midpoints
        ("top_edge_mid",        w // 2,    1),
        ("bottom_edge_mid",     w // 2,    h - 2),
        ("left_edge_mid",       1,         h // 2),
        ("right_edge_mid",      w - 2,     h // 2),
        # Slightly inset from edges (to be safely "background")
        ("inset_top_left",      20,        20),
        ("inset_top_right",     w - 21,    20),
        ("inset_bottom_left",   20,        h - 21),
        ("inset_bottom_right",  w - 21,    h - 21),
        # Mid-band background (above/below the central counter area)
        ("bg_above_counter",    w // 2,    int(h * 0.20)),
        ("bg_below_counter",    w // 2,    int(h * 0.80)),
        # Center pixel itself (likely inside the counter text)
        ("center_pixel",        w // 2,    h // 2),
    ]

    results = []
    for label, x, y in samples:
        r, g, b = rgb.getpixel((x, y))
        results.append({
            "label": label,
            "x": x,
            "y": y,
            "rgb": [r, g, b],
            "hex": f"#{r:02X}{g:02X}{b:02X}",
        })
    return results, (w, h)


def measure_bg_stats(img: Image.Image):
    """Aggregate stats across edge strips to confirm pure black."""
    rgb = img.convert("RGB")
    w, h = rgb.size

    # Build a mask of edge pixels (a 5px-wide strip around the perimeter)
    strip = 5
    pixels = list(rgb.getdata())
    edge_pixels = []
    for y in range(h):
        for x in range(w):
            if x < strip or x >= w - strip or y < strip or y >= h - strip:
                edge_pixels.append(pixels[y * w + x])

    n = len(edge_pixels)
    r_sum = sum(p[0] for p in edge_pixels)
    g_sum = sum(p[1] for p in edge_pixels)
    b_sum = sum(p[2] for p in edge_pixels)
    r_max = max(p[0] for p in edge_pixels)
    g_max = max(p[1] for p in edge_pixels)
    b_max = max(p[2] for p in edge_pixels)
    pure_black = sum(1 for p in edge_pixels if p == (0, 0, 0))

    return {
        "edge_pixel_count": n,
        "mean_rgb": [round(r_sum / n, 2), round(g_sum / n, 2), round(b_sum / n, 2)],
        "max_rgb": [r_max, g_max, b_max],
        "pure_black_pixel_count": pure_black,
        "pure_black_percent": round(100.0 * pure_black / n, 2),
    }


def measure_center_counter_area(img: Image.Image):
    """Sample a horizontal strip near the center to find the counter text color."""
    rgb = img.convert("RGB")
    w, h = rgb.size
    cy = h // 2
    # Sample 40 evenly spaced points across the center row
    samples = []
    bright = []
    for i in range(40):
        x = int(w * (i + 0.5) / 40)
        r, g, b = rgb.getpixel((x, cy))
        samples.append({"x": x, "rgb": [r, g, b]})
        if r > 200 and g > 200 and b > 200:
            bright.append({"x": x, "rgb": [r, g, b]})

    return {
        "center_row_samples": len(samples),
        "bright_white_pixels": len(bright),
        "brightest_white_pixels_sample": bright[:5],
    }


def find_green_accent(img: Image.Image):
    """Look for any green-neon-ish pixels (high G, low R, low-ish B)."""
    rgb = img.convert("RGB")
    pixels = list(rgb.getdata())
    green_hits = []
    for i, (r, g, b) in enumerate(pixels):
        if g > 120 and g > r * 1.5 and g > b * 1.2 and r < 150:
            green_hits.append((i, (r, g, b)))
            if len(green_hits) >= 20:
                break
    w, h = rgb.size
    return {
        "green_pixel_hits": len(green_hits),
        "sample_green_pixels": [{"x": h // 0 if False else 0, "rgb": list(p)} for _, p in green_hits[:5]],
        "note": "Green-neon detection: G>120, G>R*1.5, G>B*1.2, R<150",
    }


def main():
    img = Image.open(IMG_PATH)
    w, h = img.size
    print(f"Image: {IMG_PATH}")
    print(f"Size: {w} x {h}, mode: {img.mode}\n")

    samples, _ = sample(img)
    print("=== Per-pixel samples ===")
    for s in samples:
        print(f"  {s['label']:25s} ({s['x']:>4},{s['y']:>4})  RGB={s['rgb']}  HEX={s['hex']}")

    print("\n=== Edge strip aggregate stats (5px perimeter) ===")
    stats = measure_bg_stats(img)
    print(json.dumps(stats, indent=2))

    print("\n=== Center row (counter text) ===")
    center = measure_center_counter_area(img)
    print(json.dumps(center, indent=2))

    print("\n=== Green accent detection ===")
    green = find_green_accent(img)
    print(json.dumps(green, indent=2))

    # Final verdict
    print("\n=== VERDICT ===")
    mean = stats["mean_rgb"]
    mx = stats["max_rgb"]
    pure_pct = stats["pure_black_percent"]
    if all(v <= 1 for v in mean):
        print(f"Mean edge RGB = {mean}  -> background is effectively PURE BLACK")
    else:
        print(f"Mean edge RGB = {mean}  -> background is NOT pure black")

    print(f"Max edge RGB = {mx}")
    print(f"Pure-black edge pixels: {pure_pct}%")

    if pure_pct >= 99.5:
        bg_verdict = "PURE BLACK (#000000) — confirmed"
    elif pure_pct >= 95:
        bg_verdict = "NEAR black but not pure #000000 (likely #050505 or similar)"
    else:
        bg_verdict = "NOT pure black"
    print(f"Background verdict: {bg_verdict}")


if __name__ == "__main__":
    main()
