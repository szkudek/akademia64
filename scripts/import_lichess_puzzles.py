#!/usr/bin/env python3
"""Import 100,000 verified CC0 Lichess chess puzzles as lazy-loaded browser shards."""
import csv
import io
import json
import os
import random
import shutil
import tempfile
from collections import defaultdict
from pathlib import Path

import chess
import requests
import zstandard

TARGET = 100_000
URL = "https://database.lichess.org/lichess_db_puzzle.csv.zst"
DEST = Path("dist/puzzles")
INDEX = Path("dist/puzzle-index.json")
BAND = 200
SHARD_SIZE = 500
rows = defaultdict(list)
seen = set()
accepted = 0
examined = 0

with requests.get(URL, stream=True, timeout=(20, 120)) as response:
    response.raise_for_status()
    response.raw.decode_content = False
    with zstandard.ZstdDecompressor().stream_reader(response.raw) as stream:
        with io.TextIOWrapper(stream, encoding="utf-8", newline="") as text_stream:
            for entry in csv.DictReader(text_stream):
                examined += 1
                try:
                    pid = entry["PuzzleId"]
                    rating = int(entry["Rating"])
                    fen = entry["FEN"]
                    line = entry["Moves"].split()
                    if not (pid.isalnum() and 400 <= rating <= 3200 and len(line) >= 2
                            and len(line) % 2 == 0 and pid not in seen):
                        continue
                    board = chess.Board(fen)
                    for uci in line:
                        move = chess.Move.from_uci(uci)
                        if move not in board.legal_moves:
                            raise ValueError("illegal UCI")
                        board.push(move)
                    # The first move belongs to the opponent and is played before display.
                    themes = entry.get("Themes", "").split()
                    puzzle = [pid, fen, " ".join(line), rating, " ".join(themes[:8])]
                except (ValueError, KeyError, chess.InvalidMoveError):
                    continue
                seen.add(pid)
                rows[(rating // BAND) * BAND].append(puzzle)
                accepted += 1
                if accepted >= TARGET:
                    break

if accepted != TARGET:
    raise RuntimeError(f"Only {accepted} valid unique puzzles, expected {TARGET}")
stage = Path(tempfile.mkdtemp(prefix="a64-puzzles-"))
rng = random.Random(64)
shards = []
for low, puzzles in sorted(rows.items()):
    rng.shuffle(puzzles)
    for i in range(0, len(puzzles), SHARD_SIZE):
        chunk = puzzles[i:i + SHARD_SIZE]
        name = f"r{low:04d}-{i // SHARD_SIZE:03d}.json"
        (stage / name).write_text(json.dumps(chunk, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        shards.append({"file": name, "min": low, "max": low + BAND - 1, "count": len(chunk)})

index = {"source": "Lichess Puzzle Database", "license": "CC0",
         "sourceUrl": URL, "count": accepted, "format": "tuple-v1",
         "fields": ["id", "fen", "moves", "rating", "themes"],
         "shards": shards}
if sum(s["count"] for s in shards) != TARGET:
    raise RuntimeError("Incorrect shard total")
if DEST.exists():
    shutil.rmtree(DEST)
shutil.move(str(stage), str(DEST))
INDEX.write_text(json.dumps(index, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print(f"Imported {accepted:,} verified puzzles after examining {examined:,} entries in {len(shards)} shards")
print(f"Shard size total: {sum(p.stat().st_size for p in DEST.glob('*.json')):,} bytes")
