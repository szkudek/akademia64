#!/usr/bin/env python3
"""Extend the published Lichess puzzle bank without moving existing puzzles."""
import argparse
import csv
import io
import json
import random
from collections import defaultdict
from pathlib import Path

import chess
import requests
import zstandard

URL = "https://database.lichess.org/lichess_db_puzzle.csv.zst"
DEST = Path("dist/puzzles")
INDEX = Path("dist/puzzle-index.json")
LOOKUP = Path("dist/puzzle-lookup")
BAND = 200
SHARD_SIZE = 500


def write_json(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


def puzzle_rows():
    with requests.get(URL, stream=True, timeout=(20, 120)) as response:
        response.raise_for_status()
        with zstandard.ZstdDecompressor().stream_reader(response.raw) as stream:
            with io.TextIOWrapper(stream, encoding="utf-8", newline="") as text:
                yield from csv.DictReader(text)


def import_puzzles(target):
    index = json.loads(INDEX.read_text(encoding="utf-8"))
    shards = index["shards"]
    buckets = defaultdict(dict)
    next_shard = defaultdict(int)
    seen = set()

    def add_lookup(pid, slot):
        if pid in seen:
            raise ValueError(f"Duplicate puzzle: {pid}")
        seen.add(pid)
        buckets[pid[:2].lower()][pid] = slot

    for slot, shard in enumerate(shards):
        rows = json.loads((DEST / shard["file"]).read_text(encoding="utf-8"))
        if not 0 < len(rows) == shard["count"] <= SHARD_SIZE:
            raise ValueError(f"Invalid existing shard: {shard['file']}")
        for pid, _, _, rating, _ in rows:
            if not shard["min"] <= rating <= shard["max"]:
                raise ValueError(f"Puzzle outside shard range: {pid}")
            add_lookup(pid, slot)
        number = int(Path(shard["file"]).stem.rsplit("-", 1)[1])
        next_shard[shard["min"]] = max(next_shard[shard["min"]], number + 1)

    if len(seen) != index["count"] or target < len(seen):
        raise ValueError("Existing puzzle count or target is invalid")

    new_rows = defaultdict(list)
    accepted = len(seen)
    if accepted < target:
        source = puzzle_rows()
        try:
            for entry in source:
                pid = entry["PuzzleId"]
                if pid in seen or not (pid.isascii() and pid.isalnum()):
                    continue
                try:
                    rating = int(entry["Rating"])
                    fen = entry["FEN"]
                    line = entry["Moves"].split()
                    if not 400 <= rating <= 3200 or len(line) < 2 or len(line) % 2:
                        continue
                    board = chess.Board(fen)
                    for uci in line:
                        move = chess.Move.from_uci(uci)
                        if move not in board.legal_moves:
                            raise ValueError("illegal UCI")
                        board.push(move)
                except ValueError:
                    continue
                seen.add(pid)
                themes = entry.get("Themes", "").split()
                new_rows[rating // BAND * BAND].append(
                    [pid, fen, " ".join(line), rating, " ".join(themes[:8])]
                )
                accepted += 1
                if accepted % 100_000 == 0:
                    print(f"Validated {accepted:,} puzzles", flush=True)
                if accepted == target:
                    break
        finally:
            source.close()

    if accepted != target:
        raise RuntimeError(f"Only {accepted} valid unique puzzles, expected {target}")

    rng = random.Random(64)
    for low, rows in sorted(new_rows.items()):
        rng.shuffle(rows)
        for i in range(0, len(rows), SHARD_SIZE):
            chunk = rows[i:i + SHARD_SIZE]
            name = f"r{low:04d}-{next_shard[low]:03d}.json"
            next_shard[low] += 1
            slot = len(shards)
            write_json(DEST / name, chunk)
            shards.append({"file": name, "min": low, "max": low + BAND - 1, "count": len(chunk)})
            for pid, *_ in chunk:
                buckets[pid[:2].lower()][pid] = slot

    LOOKUP.mkdir(exist_ok=True)
    for prefix, entries in buckets.items():
        write_json(LOOKUP / f"{prefix}.json", entries)
    index.update(count=accepted, lookup="puzzle-lookup", shards=shards)
    write_json(INDEX, index)
    print(f"Published {accepted:,} unique puzzles in {len(shards):,} shards")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--target", type=int, default=1_000_000)
    import_puzzles(parser.parse_args().target)
