# 🤖 산업안전 안심봇 ＞ MSDS·유해물질 스마트 관리 모듈

본 모듈은 **"학교 산업안전 안심봇"** 프로젝트의 5대 핵심 기능 중 하나인 **【MSDS·유해물질 스마트 관리시스템】**의 순수 프로그램 패키지입니다. 코덱스(Codex) 및 통합 안심봇 환경에서 바로 실행 및 연동할 수 있도록 최적화되어 있습니다.

---

## 📁 프로그램 파일 구성

| 파일명 | 구분 | 설명 및 역할 |
| :--- | :---: | :--- |
| `index.html` | Front-end | 단일 페이지 반응형 웹 앱 UI (4단계 스마트 워크플로우, GHS 라벨 생성, 대장 통합 관리) |
| `server.js` | Back-end | 경량 Node.js 서버 (정적 파일 서빙, 공공데이터 API 프록시, 통합 서버 AI 중계) |
| `package.json` | Config | Node.js 프로젝트 설정 및 구동 스크립트 (`npm start`) |
| `extract_table.py` | Engine | 공식 MSDS PDF 원문 16개 항목 및 GHS 그림문자 정밀 추출 파이썬 스크립트 |
| `parse_ledger.py` | Engine | 한글(HWP, HWPX) 및 엑셀 기존 관리대장 자동 추출 및 중복 필터링 엔진 |
| `requirements.txt` | Dependency | 파이썬 필수 라이브러리 명세 (`pymupdf`, `olefile`) |
| `실행하기.bat` | Launcher | 윈도우 환경 원클릭 실행 배치 파일 (Node/Python 자동 감지 및 포트 3000 구동) |
| `uploads/` | Storage | PDF 분석 중 임시 파일과 추출된 GHS 그림문자 보관 디렉터리. 임시 PDF는 분석 후 삭제합니다. |

---

## 🚀 빠른 실행 방법

### 1) 로컬 단독 실행
* `실행하기.bat` 더블 클릭  
  또는 터미널에서:
  ```bash
  # 파이썬 의존성 설치 (최초 1회)
  pip install -r requirements.txt

  # 서버 구동
  npm start
  # 또는 node server.js
  ```
* 브라우저 접속: `http://localhost:3000`

---

## 🔗 산업안전 안심봇(Codex) 통합 연동 가이드

1. **메인 안심봇에서 호출 시**
   * 메인 챗봇 메뉴 또는 대시보드에서 `http://localhost:3000` (또는 지정 포트)으로 새 창 또는 iframe 연결
   * 상단 좌측 `[⬅ 안심봇으로 돌아가기]` 버튼 클릭 시 메인 안심봇 창으로 복귀 (`window.close()` / 부모 창 포커스)

2. **환경 설정 (API 키)**
   * 통합 프로그램 루트의 `.env.local`에 `OPENROUTER_API_KEY`를 입력하고 `실행하기.bat`으로 통합 프로그램을 다시 시작합니다. MSDS 화면은 서버 연결 상태만 표시하며 브라우저에 키를 보관하지 않습니다.
   * MSDS AI 모델은 통합 서버에서 `google/gemini-3.1-flash-lite`로 지정합니다. MSDS만 단독 실행하면 통합 서버가 없으므로 AI 분석은 사용할 수 없습니다.
