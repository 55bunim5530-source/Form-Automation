@echo off
setlocal
cd /d "%~dp0"

title 학교 MSDS 스마트 관리시스템

echo =======================================================
echo   학교 산업안전보건 MSDS 스마트 관리시스템 실행
echo =======================================================
echo.

set NODE_CMD=node
where node >nul 2>nul
if errorlevel 1 (
  if exist "C:\Program Files\nodejs\node.exe" (
    set "NODE_CMD=C:\Program Files\nodejs\node.exe"
  ) else if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" (
    set "NODE_CMD=%LOCALAPPDATA%\Programs\nodejs\node.exe"
  ) else (
    echo [오류] Node.js가 설치되어 있지 않습니다.
    echo https://nodejs.org/ 에서 Node.js LTS 버전을 설치해 주세요.
    echo.
    pause
    exit /b 1
  )
)

where python >nul 2>nul
if errorlevel 1 (
  echo [안내] Python 환경이 감지되지 않았습니다. (일반 웹 기능은 정상 작동)
) else (
  echo [안내] Python 환경이 정상 확인되었습니다.
)

echo.
echo [서버 구동] 웹 서버를 실행합니다...
echo (이 창을 닫으면 서버가 종료됩니다)
echo 잠시 후 기본 웹 브라우저가 자동으로 열립니다: http://localhost:3000
echo =======================================================
echo.

%NODE_CMD% server.js

pause