"""Build the opening lesson previews with Node.js, Pillow and a chess glyph font."""

import argparse
import json
from pathlib import Path
import subprocess

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
BOARD = 192
SQUARE = BOARD // 8
HEIGHT = 212
PIECES = dict(zip("kqrbnp", "♚♛♜♝♞♟"))


def load_examples():
    script = """
import { openingCourses } from './dist/opening-courses.js';
import { getOpening } from './dist/opening-library.js';
import { Chess } from './dist/vendor/chess.js';
const examples = openingCourses.flatMap(course => course.variants.map((_, index) => {
  const id = course.id + '-' + index;
  const game = new Chess();
  const frames = [{ board: game.board(), label: 'Start' }];
  getOpening('course-' + id, Chess).line.forEach((san, ply) => {
    const { from, to } = game.move(san);
    const number = Math.floor(ply / 2) + 1;
    frames.push({ board: game.board(), from, to, label: number + (ply % 2 ? '... ' : '. ') + san });
  });
  return { id, frames };
}));
console.log(JSON.stringify(examples));
"""
    output = subprocess.check_output(
        ["node", "--input-type=module", "-e", script], cwd=ROOT, encoding="utf-8"
    )
    return json.loads(output)


def render(frame, font):
    image = Image.new("RGB", (BOARD, HEIGHT), "#233b31")
    draw = ImageDraw.Draw(image)
    for row, rank in enumerate(frame["board"]):
        for col, piece in enumerate(rank):
            x, y = col * SQUARE, row * SQUARE
            square = f"{chr(97 + col)}{8 - row}"
            dark = (row + col) % 2
            fill = ("#e4d9bc", "#789080")[dark]
            if square in (frame.get("from"), frame.get("to")):
                fill = ("#e9cf79", "#c1a65d")[dark]
            draw.rectangle((x, y, x + SQUARE - 1, y + SQUARE - 1), fill=fill)
            if piece:
                symbol = PIECES[piece["type"]]
                left, top, right, bottom = draw.textbbox((0, 0), symbol, font=font)
                draw.text(
                    (x + (SQUARE - right + left) / 2 - left,
                     y + (SQUARE - bottom + top) / 2 - top),
                    symbol, font=font, fill="#fff8df" if piece["color"] == "w" else "#173e33",
                    stroke_width=int(piece["color"] == "w"), stroke_fill="#294338",
                )
    draw.text((BOARD / 2, BOARD + 10), frame["label"], anchor="mm", fill="#fff8df")
    return image


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--font", required=True, help="Path to a font with chess glyphs")
    font = ImageFont.truetype(parser.parse_args().font, 21)
    destination = ROOT / "dist" / "opening-gifs"
    destination.mkdir(exist_ok=True)
    for example in load_examples():
        frames = [render(frame, font) for frame in example["frames"]]
        durations = [650] * (len(frames) - 1) + [1550]
        name = destination / example["id"]
        frames[0].save(name.with_suffix(".gif"), save_all=True, append_images=frames[1:],
                       loop=0, duration=durations, optimize=True)
        frames[-1].save(name.with_suffix(".png"), optimize=True)


if __name__ == "__main__":
    main()
