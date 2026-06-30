from __future__ import annotations

import struct
import sys
from pathlib import Path


TYPE_SIZES = {
    1: 1,  # BYTE
    2: 1,  # ASCII
    3: 2,  # SHORT
    4: 4,  # LONG
    5: 8,  # RATIONAL
    6: 1,  # SBYTE
    7: 1,  # UNDEFINED
    8: 2,  # SSHORT
    9: 4,  # SLONG
    10: 8,  # SRATIONAL
    11: 4,  # FLOAT
    12: 8,  # DOUBLE
}


def unpack(endian: str, fmt: str, data: bytes):
    return struct.unpack(endian + fmt, data)


def read_value(blob: bytes, endian: str, type_id: int, count: int, value_field: bytes):
    size = TYPE_SIZES.get(type_id)
    if not size:
        return None

    total = size * count
    data = value_field if total <= 4 else blob[unpack(endian, "I", value_field)[0] : unpack(endian, "I", value_field)[0] + total]

    if type_id == 3:
        values = unpack(endian, "H" * count, data[:total])
    elif type_id == 4:
        values = unpack(endian, "I" * count, data[:total])
    elif type_id == 9:
        values = unpack(endian, "i" * count, data[:total])
    elif type_id == 2:
        return data[:total].split(b"\x00", 1)[0].decode("latin-1", errors="replace")
    else:
        return data[:total]

    return values[0] if count == 1 else values


def read_ifd(blob: bytes, endian: str, offset: int):
    if offset <= 0 or offset + 2 > len(blob):
        return {}, 0

    count = unpack(endian, "H", blob[offset : offset + 2])[0]
    entries = {}
    cursor = offset + 2

    for _ in range(count):
        entry = blob[cursor : cursor + 12]
        if len(entry) < 12:
            break
        tag, type_id, value_count = unpack(endian, "HHI", entry[:8])
        entries[tag] = read_value(blob, endian, type_id, value_count, entry[8:12])
        cursor += 12

    next_offset = 0
    if cursor + 4 <= len(blob):
        next_offset = unpack(endian, "I", blob[cursor : cursor + 4])[0]
    return entries, next_offset


def collect_ifds(blob: bytes):
    if blob[:2] == b"II":
        endian = "<"
    elif blob[:2] == b"MM":
        endian = ">"
    else:
        raise ValueError("Not a TIFF/NEF file")

    magic = unpack(endian, "H", blob[2:4])[0]
    if magic != 42:
        raise ValueError("Unsupported TIFF magic")

    first_ifd = unpack(endian, "I", blob[4:8])[0]
    seen = set()
    pending = [first_ifd]
    all_ifds = []

    while pending:
        offset = pending.pop(0)
        if offset in seen:
            continue
        seen.add(offset)
        entries, next_offset = read_ifd(blob, endian, offset)
        if not entries:
            continue
        all_ifds.append((offset, entries))

        if next_offset:
            pending.append(next_offset)

        sub_ifds = entries.get(330)
        if isinstance(sub_ifds, int):
            pending.append(sub_ifds)
        elif isinstance(sub_ifds, tuple):
            pending.extend(sub_ifds)

        exif_ifd = entries.get(34665)
        if isinstance(exif_ifd, int):
            pending.append(exif_ifd)

    return all_ifds


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: extract_nef_preview.py INPUT.NEF OUTPUT.jpg", file=sys.stderr)
        return 2

    source = Path(sys.argv[1])
    output = Path(sys.argv[2])
    blob = source.read_bytes()
    candidates = []

    for offset, entries in collect_ifds(blob):
        jpeg_offset = entries.get(513)
        jpeg_length = entries.get(514)
        width = entries.get(256)
        height = entries.get(257)
        compression = entries.get(259)

        if isinstance(jpeg_offset, int) and isinstance(jpeg_length, int):
            start = jpeg_offset
            end = jpeg_offset + jpeg_length
            if 0 <= start < end <= len(blob):
                data = blob[start:end]
                if data.startswith(b"\xff\xd8"):
                    candidates.append((jpeg_length, width, height, offset, data))
                    print(f"candidate ifd={offset} {width}x{height} bytes={jpeg_length} compression={compression}")

    if not candidates:
        print("No embedded JPEG preview found.", file=sys.stderr)
        return 1

    candidates.sort(key=lambda item: item[0], reverse=True)
    length, width, height, offset, data = candidates[0]
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(data)
    print(f"wrote {output} from ifd={offset} {width}x{height} bytes={length}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
