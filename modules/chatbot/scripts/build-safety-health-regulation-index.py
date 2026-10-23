#!/usr/bin/env python3
"""Build an article-level search index for the 2022 Seoul safety regulation PDF.

The PDF uses embedded Korean fonts that do not expose usable Unicode text. Render
pages 4-13 at 300 DPI and run Windows Korean OCR first, saving page-04.txt through
page-13.txt. This script cleans that OCR and creates one chunk per article.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path


SOURCE_TITLE = "서울특별시교육청 안전보건관리규정"
SOURCE_PUBLISHER = "서울특별시교육청"
SOURCE_DATE = "2022-09-01"

ARTICLE_TITLES = {
    1: "목적",
    2: "정의",
    3: "적용범위",
    4: "재해예방 의무",
    5: "안전보건관리 조직",
    6: "안전보건관리책임자의 선임",
    7: "관리감독자",
    8: "안전관리자의 선임",
    9: "보건관리자의 선임",
    10: "산업보건의의 선임 등",
    11: "산업안전보건위원회",
    12: "안전보건교육 계획의 수립",
    13: "근로자의 정기안전보건교육",
    14: "관리감독자의 정기 안전보건교육 등",
    15: "채용 시 교육 등",
    16: "관리책임자 등 직무교육",
    17: "안전보건관리계획 수립",
    18: "방호조치 등",
    19: "안전작업 방법 작성 및 준수",
    20: "작업중지 및 보고",
    21: "안전보건순회점검",
    22: "안전보건표지등의 설치·부착",
    23: "위험성평가의 실시",
    24: "건강진단",
    25: "작업환경측정",
    26: "보호구",
    27: "물질안전보건자료의 작성·비치",
    28: "근골격계질환 예방 등",
    29: "사고 발생 시 처리 절차",
    30: "사고 원인조사",
    31: "재해발생현황 분석 및 대책 수립",
    32: "세부시행계획",
    33: "기록물의 보존",
    34: "규정의 개정 등",
    35: "기타 사항",
}

CHAPTERS = {
    range(1, 5): "제1장 총칙",
    range(5, 12): "제2장 안전보건관리 조직과 직무",
    range(12, 17): "제3장 안전보건교육",
    range(17, 24): "제4장 사업장 안전관리",
    range(24, 29): "제5장 사업장 보건관리",
    range(29, 32): "제6장 사고조사 및 대책수립 등",
    range(32, 36): "제7장 보칙",
}

CATEGORIES = {
    1: "regulation", 2: "regulation", 3: "regulation", 4: "accident",
    5: "organization", 6: "organization", 7: "supervisor", 8: "organization",
    9: "health", 10: "health", 11: "organization",
    12: "education", 13: "education", 14: "supervisor", 15: "education", 16: "education",
    17: "inspection", 18: "ppe", 19: "inspection", 20: "accident",
    21: "inspection", 22: "signage", 23: "risk",
    24: "health", 25: "environment", 26: "ppe", 27: "msds", 28: "musculoskeletal",
    29: "accident", 30: "accident", 31: "accident",
    32: "regulation", 33: "regulation", 34: "regulation", 35: "regulation",
}

SEARCH_TERMS = {
    1: ["규정 목적", "산업재해 예방", "쾌적한 작업환경"],
    2: ["사업장 정의", "근로자 정의", "근로자대표", "중대재해 정의"],
    3: ["현업업무 종사자", "적용 대상", "관계 법령"],
    4: ["재해예방 의무", "교육감 의무", "관리감독자 의무", "근로자 의무"],
    5: ["안전보건관리 조직체제", "권한", "시설 장비 예산"],
    6: ["안전보건관리책임자", "부교육감", "총괄 관리", "산업재해 예방계획"],
    7: ["관리감독자 직무", "보호구 방호장치 점검", "정리정돈", "위험성평가 참여"],
    8: ["안전관리자 업무", "안전관리자 선임", "순회점검", "기술적 지도 조언"],
    9: ["보건관리자 업무", "보건관리자 선임", "환기장치", "건강관리"],
    10: ["산업보건의", "의사", "직업환경의학과", "예방의학과"],
    11: ["산업안전보건위원회", "위원회 구성 운영", "심의 의결"],
    12: ["안전보건교육 계획", "교육기관 위탁", "교육 시기 방법"],
    13: ["근로자 정기교육", "분기 6시간", "정기안전보건교육"],
    14: ["관리감독자 정기교육", "연간 16시간", "교육내용", "표준안전 작업방법"],
    15: ["채용 시 교육", "근무지 변경", "안전보건교육"],
    16: ["직무교육", "관리책임자", "안전관리자", "보건관리자"],
    17: ["안전보건관리계획", "연간 계획", "점검", "위험성평가"],
    18: ["방호장치", "안전장치", "제거 개조 금지", "작업중지"],
    19: ["안전작업 방법", "기계 설비", "작업순서", "주의사항"],
    20: ["작업중지권", "급박한 위험", "대피", "불리한 처우 금지"],
    21: ["안전보건순회점검", "사업장 점검", "개선 조치"],
    22: ["안전보건표지", "경고표지", "설치 부착", "산업안전보건법령 요지"],
    23: ["위험성평가", "유해 위험요인", "허용 가능한 위험", "전문기관 위탁"],
    24: ["건강진단", "일반건강진단", "특수건강진단"],
    25: ["작업환경측정", "유해인자", "친환경 제품"],
    26: ["보호구 지급", "보호구 착용", "작업환경 조건"],
    27: ["물질안전보건자료", "MSDS", "화학물질", "경고 표시"],
    28: ["근골격계질환", "근골격계부담작업", "유해요인조사", "3년"],
    29: ["사고 처리 절차", "응급구호", "중대재해 보고", "산업재해조사표", "1개월"],
    30: ["사고 원인조사", "재발방지대책"],
    31: ["재해발생현황", "재해 원인 분석", "대책 수립"],
    32: ["세부시행계획", "세부사항"],
    33: ["기록물 보존", "회의록 2년", "서류 3년", "결과 5년"],
    34: ["규정 개정", "산업안전보건위원회", "근로자 공지"],
    35: ["기타 사항", "세부사항", "위원회 논의"],
}

REPLACEMENTS = {
    "•": "·",
    "“": '"',
    "”": '"',
    "‘": "'",
    "’": "'",
    "교우지도": "교육·지도",
    "정라정돈": "정리·정돈",
    "유자관리를": "유지·관리를",
    "장업중지": "작업중지",
    "대피시기는": "대피시키는",
    "시 작한다": "시작한다",
    "11년 이내": "1년 이내",
    "21년)": "2년)",
    "절云D": "절차)",
    "원인조八D": "원인조사)",
    "다라 정한다": "따라 정한다",
    "사 용을": "사용을",
    "포 함한": "포함한",
    "안전 보건관\n리계획": "안전보건관리계획",
    "재\n발 방지": "재발 방지",
}

COMPACT_TERMS = [
    "산업재해", "안전보건", "안전관리자", "보건관리자", "관리감독자",
    "안전보건관리책임자", "산업보건의", "산업안전보건위원회", "위험성평가",
    "유해요인조사", "근골격계부담작업", "근골격계질환", "작업환경측정",
    "물질안전보건자료", "안전작업", "재발방지", "작업중지", "응급구호",
    "안전보건주관부서", "산업재해조사표", "지방고용노동관서", "현업업무",
    "기계·기구", "이상의", "포함한",
]

CANONICAL_ARTICLE_2 = """제2조(정의) 이 규정에서 사용하는 용어의 뜻은 다음과 같다.
1. \"사업장\"이란 본청, 교육지원청, 직속기관, 공립학교, 단설유치원을 말한다.
2. \"근로자\"란 「공공행정 등에서 현업업무에 종사하는 사람의 기준」(고용노동부 고시)에 따른 현업업무에 종사하는 사람을 말한다.
3. \"근로자대표\"란 「산업안전보건법」(이하 \"법\"이라 한다) 제2조제5호에 따른 근로자대표를 말한다.
4. \"안전보건주관부서\"란 산업안전보건업무를 주관하는 서울특별시교육청 정책안전기획관 산업안전보건팀을 말한다.
5. \"중대재해\"란 산업재해 중 재해정도가 심한 것으로 다음 각 목의 어느 하나에 해당하는 재해를 말한다.
가. 사망자가 1명 이상 발생한 재해
나. 3개월 이상의 요양이 필요한 부상자가 동시에 2명 이상 발생한 재해
다. 부상자 또는 직업성 질병자가 동시에 10명 이상 발생한 재해"""

CANONICAL_ARTICLE_18 = """제18조(방호조치 등) ① 관리감독자는 유해·위험기계·기구에 대하여 성능검사 검정품인 방호장치를 사용하도록 하며, 방호장치를 유지·관리하도록 한다.
② 근로자는 관리감독자의 허가 없이 방호장치 및 안전장치를 제거, 개조 등의 행위를 하여서는 안 되며, 방호장치 및 안전장치 기능이 상실된 것을 발견한 때에는 지체 없이 사용을 중지하고 관리감독자에게 보고한다.
③ 관리감독자는 제2항에 따른 보고를 받으면 수리, 보수 및 작업중지 등 적절한 조치를 해야 한다."""


def chapter_for(number: int) -> str:
    for numbers, chapter in CHAPTERS.items():
        if number in numbers:
            return chapter
    raise ValueError(f"No chapter for article {number}")


def clean_text(lines: list[str], number: int, is_appendix: bool) -> str:
    cleaned = "\n".join(line.strip() for line in lines if line.strip())
    for before, after in REPLACEMENTS.items():
        cleaned = cleaned.replace(before, after)
    cleaned = re.sub(r"^=\s*0\s*0\s*근\s*$", "", cleaned, flags=re.MULTILINE)
    cleaned = re.sub(r"[ \t]+", " ", cleaned)
    cleaned = re.sub(r"\n{2,}", "\n", cleaned).strip()

    markers = list(re.finditer(r"[㉦㉨㉭]", cleaned))
    if markers:
        circled = "①②③④⑤⑥"
        parts: list[str] = []
        cursor = 0
        for index, marker in enumerate(markers):
            parts.append(cleaned[cursor:marker.start()])
            parts.append(circled[min(index, len(circled) - 1)])
            cursor = marker.end()
        parts.append(cleaned[cursor:])
        cleaned = "".join(parts)

    paragraphs: list[str] = []
    for line in cleaned.splitlines():
        line = line.strip()
        if not line:
            continue
        starts_block = bool(re.match(r"^(?:제\d+조|부칙 제\d+조|[①②③④⑤⑥]|\d+\.|[가나다라마바사아자차카타파하]\.)", line))
        if paragraphs and not starts_block:
            paragraphs[-1] = f"{paragraphs[-1]} {line}"
        else:
            paragraphs.append(line)
    cleaned = "\n".join(paragraphs)

    for term in COMPACT_TERMS:
        pattern = r"\s*".join(map(re.escape, term))
        cleaned = re.sub(pattern, term, cleaned)
    cleaned = cleaned.replace("안전 보건관리계획", "안전보건관리계획")
    cleaned = cleaned.replace("관리 감독자", "관리감독자")
    cleaned = cleaned.replace("지체없이", "지체 없이")
    if number == 9 and not is_appendix:
        cleaned = cleaned.replace("\n11. 근로자의 건강관리", "\n12. 근로자의 건강관리")
    if number == 2 and not is_appendix:
        return CANONICAL_ARTICLE_2
    if number == 18 and not is_appendix:
        return CANONICAL_ARTICLE_18
    return cleaned


def parse_pages(ocr_dir: Path) -> list[dict[str, object]]:
    records: list[tuple[int, str]] = []
    for page in range(4, 14):
        page_path = ocr_dir / f"page-{page:02d}.txt"
        if not page_path.exists():
            raise FileNotFoundError(page_path)
        for line in page_path.read_text(encoding="utf-8-sig").splitlines():
            records.append((page, line.strip()))

    header = re.compile(r"^제\s*(\d+)\s*조\(([^)]*)(?:\)\s*)?(.*)$")
    chunks: list[dict[str, object]] = []
    current: dict[str, object] | None = None
    seen_main_35 = False

    def flush() -> None:
        nonlocal current
        if current is None:
            return
        lines = current.pop("lines")
        assert isinstance(lines, list)
        number = current["articleNumber"]
        is_appendix = current["isAppendix"]
        assert isinstance(number, int)
        assert isinstance(is_appendix, bool)
        body = clean_text(lines, number, is_appendix)
        current.pop("articleNumber")
        current.pop("isAppendix")
        current["text"] = body
        chunks.append(current)
        current = None

    for page, raw_line in records:
        if not raw_line:
            continue
        line = raw_line.replace("제29조(사고 발생 시 처리 절云D", "제29조(사고 발생 시 처리 절차)")
        line = line.replace("제30조(사고 원인조八D", "제30조(사고 원인조사)")
        match = header.match(line)
        if match:
            number = int(match.group(1))
            is_appendix = seen_main_35 and number == 1
            if number in ARTICLE_TITLES or is_appendix:
                flush()
                title = "시행일" if is_appendix else ARTICLE_TITLES[number]
                section = f"부칙 제1조({title})" if is_appendix else f"{chapter_for(number)} · 제{number}조({title})"
                category = "regulation" if is_appendix else CATEGORIES[number]
                search_terms = ["부칙", "시행일", "2022년 9월 1일"] if is_appendix else SEARCH_TERMS[number]
                rest = match.group(3).strip()
                canonical_header = f"{'부칙 ' if is_appendix else ''}제{number}조({title})"
                current = {
                    "pdfPage": page,
                    "referenceLabel": f"PDF {page}쪽",
                    "category": category,
                    "searchTerms": search_terms,
                    "section": section,
                    "articleNumber": number,
                    "isAppendix": is_appendix,
                    "lines": [f"{canonical_header} {rest}".strip()],
                }
                if number == 35 and not is_appendix:
                    seen_main_35 = True
                continue
        if current is not None and not re.match(r"^제\s*\d+\s*장", line):
            lines = current["lines"]
            assert isinstance(lines, list)
            lines.append(line)
    flush()

    expected_sections = 36
    if len(chunks) != expected_sections:
        raise ValueError(f"Expected {expected_sections} article chunks, got {len(chunks)}")
    return chunks


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ocr-dir", type=Path, required=True)
    parser.add_argument("--source-pdf", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    pages = parse_pages(args.ocr_dir)
    digest = hashlib.sha256(args.source_pdf.read_bytes()).hexdigest()
    payload = {
        "sourceTitle": SOURCE_TITLE,
        "sourcePublisher": SOURCE_PUBLISHER,
        "sourceDate": SOURCE_DATE,
        "sourceUrl": None,
        "sourceSha256": digest,
        "extraction": "Windows Korean OCR from 300 DPI page renders; chunked by article",
        "chunkCount": len(pages),
        "pages": pages,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(pages)} chunks to {args.output}")


if __name__ == "__main__":
    main()
