#!/usr/bin/env python3
"""Build a semantic search index from the 2022 Ministry of Education HWP guide."""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
from pathlib import Path


SOURCE_TITLE = "산업재해 예방 관련 주요사항 안내"
SOURCE_PUBLISHER = "교육부 학교안전총괄과"
SOURCE_DATE = "2022-01-07"

INDUSTRIAL_TASKS = [
    ("산업재해 예방계획 수립", "accident"),
    ("산업재해 예방을 위한 체계 구축", "organization"),
    ("안전보건교육에 관한 사항", "education"),
    ("작업환경 점검 및 개선에 관한 사항", "environment"),
    ("근로자 건강관리에 관한 사항", "health"),
    ("산업재해 재발방지 대책 수립", "accident"),
    ("산업재해 통계기록 및 유지·관리", "accident"),
    ("안전시설 및 보호구", "ppe"),
    ("유해‧위험 방지 활동", "risk"),
]

SERIOUS_TASKS = [
    ("안전‧보건 목표와 경영방침의 설정", "serious"),
    ("안전‧보건 업무 총괄‧관리 전담조직 설치", "organization"),
    ("유해‧위험요인의 확인 후 업무절차 개선", "risk"),
    ("재해예방에 필요한 예산 편성 및 용도에 맞는 집행", "serious"),
    ("안전보건관리책임자등의 충실한 업무수행 지원", "organization"),
    ("안전관리자, 보건관리자 등 전문인력 배치", "organization"),
    ("종사자 의견 청취 후 개선방안 마련 및 이행", "serious"),
    ("중대산업재해 발생 대비 매뉴얼 마련", "accident"),
    ("도급, 용역, 위탁 등 종사자의 안전 보건 확보를 위한 조치", "contractor"),
]

COMMON_CHECKS = [
    ("경영자 리더십", "serious"),
    ("근로자의 참여", "serious"),
    ("위험요인 파악", "risk"),
    ("위험요인 제거·대체 및 통제", "risk"),
    ("비상조치계획 수립", "accident"),
    ("도급·용역·위탁 시 안전보건 확보", "contractor"),
    ("평가 및 개선", "inspection"),
]

JOB_CHECKS = [
    ("급식종사자 관련", "inspection", ["급식실", "조리", "미끄러짐", "화상", "MSDS", "근골격계"]),
    ("경비업무 관련", "inspection", ["경비", "순찰", "야간", "보호구", "중량물"]),
    ("통학보조 관련", "inspection", ["통학차량", "승하차", "안전띠", "운전"]),
    ("시설관리 관련", "inspection", ["시설관리", "사다리", "감전", "화학물질", "중량물"]),
    ("복도 및 화장실 청소 작업 관련", "inspection", ["청소", "화장실", "미끄러짐", "사다리", "세제"]),
]

QA_CATEGORIES = [
    ("① 산업재해", "산업재해", "accident"),
    ("② 산업안전보건법령 요지 게시 및 안전보건표지 부착", "법령 요지·안전보건표지", "signage"),
    ("③ 화학물질 취급(물질안전보건자료, MSDS)", "화학물질·MSDS", "msds"),
    ("④ 위험성평가", "위험성평가", "risk"),
    ("⑤ 근골격계 유해요인조사", "근골격계 유해요인조사", "musculoskeletal"),
    ("⑥ 안전보건교육", "안전보건교육", "education"),
    ("⑦ 사업장 관련", "사업장", "organization"),
    ("⑧ 중대재해처벌법 관련", "중대재해처벌법", "serious"),
]


def nth_index(text: str, needle: str, occurrence: int = 1, start: int = 0) -> int:
    cursor = start
    for _ in range(occurrence):
        cursor = text.index(needle, cursor)
        cursor += 1
    return cursor - 1


def clean_markdown(value: str) -> str:
    value = re.sub(r"!\[[^]]*]\([^)]*\)", "", value)
    value = value.replace("<br>", "\n").replace("<br/>", "\n")
    value = re.sub(r"<sup>(.*?)</sup>", r"\1", value, flags=re.DOTALL)
    value = re.sub(r"</?(?:table|thead|tbody|tr|th|td)[^>]*>", " ", value, flags=re.IGNORECASE)
    value = re.sub(r"<[^>]+>", " ", value)
    value = html.unescape(value)
    value = value.replace("\\~", "~").replace("\\*", "*")
    value = value.replace("중대해재처벌법", "중대재해처벌법")
    value = value.replace("근골결계", "근골격계")
    value = value.replace("확임됨", "확인됨")
    value = re.sub(r"\|\s*---(?:\s*\|\s*---)+\s*\|", "", value)
    value = re.sub(r"[ \t]+", " ", value)
    value = re.sub(r"\n\s*\n\s*\n+", "\n\n", value)
    return value.strip()


def split_long(value: str, max_chars: int = 3900) -> list[str]:
    value = clean_markdown(value)
    if len(value) <= max_chars:
        return [value]
    lines = [line.strip() for line in value.splitlines() if line.strip()]
    parts: list[str] = []
    current: list[str] = []
    size = 0
    for line in lines:
        addition = len(line) + 1
        if current and size + addition > max_chars:
            parts.append("\n".join(current))
            current = []
            size = 0
        current.append(line)
        size += addition
    if current:
        parts.append("\n".join(current))
    return parts


def marker_for_task(title: str, number: int) -> str:
    return f"| {number} |  | {title} |"


def add_semantic_chunk(
    pending: list[dict[str, object]],
    section: str,
    reference: str,
    category: str,
    search_terms: list[str],
    raw_text: str,
) -> None:
    parts = split_long(raw_text)
    for index, part in enumerate(parts, start=1):
        suffix = f" ({index}/{len(parts)})" if len(parts) > 1 else ""
        pending.append({
            "referenceLabel": f"{reference}{suffix}",
            "category": category,
            "searchTerms": list(dict.fromkeys([section, *search_terms])),
            "section": f"{section}{suffix}",
            "text": part,
        })


def build_chunks(markdown: str) -> list[dict[str, object]]:
    pending: list[dict[str, object]] = []

    background_start = nth_index(markdown, "Ⅰ. 추진 배경 및 경과", 2)
    policy_start = nth_index(markdown, "Ⅱ. 정책방향", 2)
    tasks_start = nth_index(markdown, "Ⅲ. 주요 추진과제", 1)
    first_industrial = markdown.index(marker_for_task(INDUSTRIAL_TASKS[0][0], 1), tasks_start)
    add_semantic_chunk(pending, "추진 배경 및 경과", "본문 · 추진 배경", "regulation", ["산업안전보건법", "중대재해처벌법", "교육현장"], markdown[background_start:policy_start])
    add_semantic_chunk(pending, "정책방향", "본문 · 정책방향", "regulation", ["교육부 안전보건 목표", "안전한 작업환경", "산업안전 역량강화"], markdown[policy_start:tasks_start])

    industrial_markers = [markdown.index(marker_for_task(title, i), first_industrial) for i, (title, _) in enumerate(INDUSTRIAL_TASKS, start=1)]
    serious_header = markdown.index("| 2 |  | 현장 관리‧감독 위한 안전보건관리시스템 구축", industrial_markers[-1])
    for index, ((title, category), start) in enumerate(zip(INDUSTRIAL_TASKS, industrial_markers), start=1):
        end = industrial_markers[index] if index < len(industrial_markers) else serious_header
        add_semantic_chunk(pending, f"산업안전보건법 과제 {index}. {title}", f"본문 · 산업안전보건법 과제 {index}", category, [title, "산업안전보건법"], markdown[start:end])

    serious_markers = [markdown.index(marker_for_task(title, i), serious_header) for i, (title, _) in enumerate(SERIOUS_TASKS, start=1)]
    appendix1 = markdown.index("| 붙임1 |", serious_markers[-1])
    for index, ((title, category), start) in enumerate(zip(SERIOUS_TASKS, serious_markers), start=1):
        end = serious_markers[index] if index < len(serious_markers) else appendix1
        add_semantic_chunk(pending, f"중대재해처벌법 과제 {index}. {title}", f"본문 · 중대재해처벌법 과제 {index}", category, [title, "중대재해처벌법"], markdown[start:end])

    appendix2 = markdown.index("| 붙임2 |", appendix1)
    add_semantic_chunk(pending, "붙임1. 안전보건관리체계 점검표(요약)", "붙임1 · 요약 점검표", "inspection", ["안전보건관리체계", "중대재해처벌법", "자가진단"], markdown[appendix1:appendix2])

    common_markers = [markdown.index(f"{i}. {title}", appendix2) for i, (title, _) in enumerate(COMMON_CHECKS, start=1)]
    appendix3 = markdown.index("| 붙임3 |", common_markers[-1])
    for index, ((title, category), start) in enumerate(zip(COMMON_CHECKS, common_markers), start=1):
        end = common_markers[index] if index < len(common_markers) else appendix3
        add_semantic_chunk(pending, f"붙임2. 공통 자율점검 - {title}", f"붙임2 · 공통점검 {index}", category, [title, "안전보건관리체계", "자가진단"], markdown[start:end])

    job_markers = [markdown.index(f"{i}. {title}", appendix3) for i, (title, _, _) in enumerate(JOB_CHECKS, start=1)]
    appendix4 = markdown.index("| 붙임4 |", job_markers[-1])
    for index, ((title, category, terms), start) in enumerate(zip(JOB_CHECKS, job_markers), start=1):
        end = job_markers[index] if index < len(job_markers) else appendix4
        add_semantic_chunk(pending, f"붙임3. 직종별 자율점검 - {title}", f"붙임3 · 직종별점검 {index}", category, [title, "자가진단", *terms], markdown[start:end])

    appendix5 = markdown.index("| 붙임5 |", appendix4)
    qa_block = markdown[appendix4:appendix5]
    qa_starts = [qa_block.index(marker) for marker, _, _ in QA_CATEGORIES]
    for category_index, ((marker, label, category), category_start) in enumerate(zip(QA_CATEGORIES, qa_starts)):
        category_end = qa_starts[category_index + 1] if category_index + 1 < len(qa_starts) else len(qa_block)
        category_text = qa_block[category_start:category_end]
        matches = list(re.finditer(r"(?m)^Q(\d+)\.\s+(.+)$", category_text))
        for question_index, match in enumerate(matches):
            start = match.start()
            end = matches[question_index + 1].start() if question_index + 1 < len(matches) else len(category_text)
            number = match.group(1)
            continuation: list[str] = []
            has_continuation = False
            for line in category_text[match.end():end].splitlines():
                line = line.strip()
                if not line:
                    if has_continuation:
                        break
                    continue
                if line.startswith("○"):
                    break
                continuation.append(line.removeprefix("-").strip())
                has_continuation = True
            question = clean_markdown(" / ".join([match.group(2).strip(), *continuation]))
            add_semantic_chunk(pending, f"붙임4. {label} Q{number}. {question}", f"붙임4 · {label} Q{number}", category, [label, question], category_text[start:end])

    add_semantic_chunk(pending, "붙임5. 교육기관 산업재해 통계 조사(2021년 상반기)", "붙임5 · 2021년 상반기 통계", "accident", ["교육기관 산업재해 통계", "재해율", "조리", "시설", "청소", "넘어짐"], markdown[appendix5:])

    chunks: list[dict[str, object]] = []
    for index, item in enumerate(pending, start=1):
        item["pdfPage"] = index
        chunks.append(item)
    if len(chunks) < 60:
        raise ValueError(f"Expected at least 60 semantic chunks, got {len(chunks)}")
    return chunks


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--markdown", type=Path, required=True)
    parser.add_argument("--source-hwp", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    markdown = args.markdown.read_text(encoding="utf-8")
    chunks = build_chunks(markdown)
    payload = {
        "sourceTitle": SOURCE_TITLE,
        "sourcePublisher": SOURCE_PUBLISHER,
        "sourceDate": SOURCE_DATE,
        "sourceUrl": None,
        "sourceSha256": hashlib.sha256(args.source_hwp.read_bytes()).hexdigest(),
        "extraction": "kordoc HWP to Markdown; semantic chunks by task, checklist, Q&A, and statistics",
        "chunkCount": len(chunks),
        "pages": chunks,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(chunks)} chunks to {args.output}")


if __name__ == "__main__":
    main()
