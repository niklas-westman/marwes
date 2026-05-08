#!/usr/bin/env python3
"""
Storybook alignment audit.

Compares exported stories between a "truth" storybook and a "target" storybook,
reporting any stories present in truth but missing from target.

Usage:
  python3 audit-storybook-alignment.py <truth-root> <target-root>

Example:
  python3 docs/guides/storybook-alignment/audit-storybook-alignment.py \
    apps/storybook-react \
    apps/storybook-svelte
"""

import os
import re
import sys
from pathlib import Path

STORY_EXPORT_RE = re.compile(r"^export const (\w+)", re.MULTILINE)

REACT_EXTENSIONS = (".stories.tsx",)
SVELTE_EXTENSIONS = (".stories.ts",)
VUE_EXTENSIONS = (".stories.ts",)

ALL_STORY_EXTENSIONS = (".stories.tsx", ".stories.ts")


def detect_story_extension(root: Path) -> str:
    """Return the dominant story file extension under src/stories/."""
    stories_dir = root / "src" / "stories"
    if not stories_dir.is_dir():
        return ".stories.ts"

    tsx_count = len(list(stories_dir.rglob("*.stories.tsx")))
    ts_count = len(list(stories_dir.rglob("*.stories.ts")))

    return ".stories.tsx" if tsx_count > ts_count else ".stories.ts"


def collect_story_files(root: Path) -> dict[str, Path]:
    """Return a dict mapping normalised relative keys to file paths."""
    stories_dir = root / "src" / "stories"
    if not stories_dir.is_dir():
        print(f"Error: {stories_dir} does not exist.", file=sys.stderr)
        sys.exit(1)

    result: dict[str, Path] = {}
    for path in sorted(stories_dir.rglob("*")):
        if not path.is_file():
            continue
        if not any(path.name.endswith(ext) for ext in ALL_STORY_EXTENSIONS):
            continue

        rel = path.relative_to(stories_dir)
        # Normalise key: strip .stories.tsx / .stories.ts
        key = str(rel)
        for ext in ALL_STORY_EXTENSIONS:
            if key.endswith(ext):
                key = key[: -len(ext)]
                break

        result[key] = path

    return result


def extract_story_names(path: Path) -> set[str]:
    """Extract all `export const <Name>` from a story file."""
    content = path.read_text(encoding="utf-8")
    return set(STORY_EXPORT_RE.findall(content))


def run_audit(truth_root: Path, target_root: Path) -> int:
    """Run the audit and print results. Returns the count of missing stories."""
    truth_ext = detect_story_extension(truth_root)
    target_ext = detect_story_extension(target_root)

    truth_files = collect_story_files(truth_root)
    target_files = collect_story_files(target_root)

    total_missing = 0
    total_files_missing = 0
    missing_report: list[str] = []

    for key in sorted(truth_files):
        truth_path = truth_files[key]

        if key not in target_files:
            truth_stories = extract_story_names(truth_path)
            if truth_stories:
                total_files_missing += 1
                missing_report.append(f"\n  MISSING FILE: {key}{target_ext}")
                for name in sorted(truth_stories):
                    missing_report.append(f"    - {name}")
                total_missing += len(truth_stories)
            continue

        target_path = target_files[key]

        truth_stories = extract_story_names(truth_path)
        target_stories = extract_story_names(target_path)

        missing = sorted(truth_stories - target_stories)
        if missing:
            total_missing += len(missing)
            missing_report.append(f"\n  {key}:")
            for name in missing:
                missing_report.append(f"    - {name}")

    # Print report
    truth_name = truth_root.name
    target_name = target_root.name

    print(f"Storybook Alignment Audit")
    print(f"{'=' * 60}")
    print(f"  Truth:  {truth_root} ({truth_ext})")
    print(f"  Target: {target_root} ({target_ext})")
    print(f"{'=' * 60}")

    if not missing_report:
        print(f"\n  ✅ All stories in {truth_name} exist in {target_name}.")
        print(f"\n  Files compared: {len(truth_files)}")
    else:
        print(f"\n  ❌ Missing stories in {target_name}:")
        for line in missing_report:
            print(line)

        print(f"\n{'─' * 60}")
        print(f"  Total missing stories: {total_missing}")
        if total_files_missing:
            print(f"  Missing story files:   {total_files_missing}")
        print(f"  Files compared:        {len(truth_files)}")

    return total_missing


def main() -> None:
    if len(sys.argv) != 3:
        print(__doc__.strip())
        sys.exit(1)

    truth_root = Path(sys.argv[1])
    target_root = Path(sys.argv[2])

    if not truth_root.is_dir():
        print(f"Error: truth root '{truth_root}' is not a directory.", file=sys.stderr)
        sys.exit(1)

    if not target_root.is_dir():
        print(f"Error: target root '{target_root}' is not a directory.", file=sys.stderr)
        sys.exit(1)

    missing_count = run_audit(truth_root, target_root)
    sys.exit(1 if missing_count > 0 else 0)


if __name__ == "__main__":
    main()
