#!/usr/bin/env python3
"""Build a verified index for the 2026 supervisor remote-training notice PDF."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path


SOURCE_TITLE = "2026년도 관리감독자 정기 안전보건교육 신규 과정 개설 및 이수 안내(원격 8시간)"
SOURCE_PUBLISHER = "서울특별시교육청보건안전진흥원 산업안전보건지원과"
SOURCE_DATE = "2026-06-22"

CHUNKS = [
    {
        "pdfPage": 1,
        "referenceLabel": "공문 PDF 1쪽 · 연간 교육 구성",
        "category": "supervisor",
        "searchTerms": ["관리감독자 정기교육", "연간 16시간", "원격교육 8시간", "집합교육 8시간", "비대면 실시간교육"],
        "section": "2026년 관리감독자 정기 안전보건교육 시간 구성",
        "text": "산업안전보건법에 따라 관리감독자는 연간 16시간의 정기 안전보건교육을 이수해야 한다. 교육시간은 원격교육 8시간과 집합교육 또는 비대면 실시간교육 8시간으로 구성된다.",
    },
    {
        "pdfPage": 1,
        "referenceLabel": "공문 PDF 1쪽 · 신규 과정",
        "category": "supervisor",
        "searchTerms": ["2026 신규 과정", "수강대상", "공립학교", "교육행정기관", "교육연수원"],
        "section": "2026년 신규 원격과정 수강 대상·방법",
        "text": "기존 원격교육 콘텐츠 노후화에 따라 서울특별시교육청 자체 관리감독자 원격교육 콘텐츠를 신규 개발해 탑재했다. 수강 대상은 공립학교와 교육행정기관의 관리감독자이며, 공립학교는 학교장, 교육행정기관은 총무팀장·행정지원과장·분원장 등 자체 지정자이다. 교육연수원에 탑재된 원격과정을 수강하며 교육시간은 8시간(8차시)이다.",
    },
    {
        "pdfPage": 1,
        "referenceLabel": "공문 PDF 1쪽 · 수료증 보관",
        "category": "supervisor",
        "searchTerms": ["수료증", "보관기간 5년"],
        "section": "교육 수료증 보관",
        "text": "고용노동부 불시 점검에 대비해 교육 이수 후 수료증을 보관해야 하며 보관기간은 5년이다.",
    },
]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-pdf", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    payload = {
        "sourceTitle": SOURCE_TITLE,
        "sourcePublisher": SOURCE_PUBLISHER,
        "sourceDate": SOURCE_DATE,
        "sourceUrl": None,
        "sourceSha256": hashlib.sha256(args.source_pdf.read_bytes()).hexdigest(),
        "extraction": "Visual verification with Windows Korean OCR; manually corrected semantic chunks",
        "chunkCount": len(CHUNKS),
        "pages": CHUNKS,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(CHUNKS)} chunks to {args.output}")


if __name__ == "__main__":
    main()
