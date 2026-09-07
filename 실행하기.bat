@echo off
chcp 65001 > nul
echo ======================================================
echo    산업안전보건 서식 자동화 시스템을 시작합니다...
echo ======================================================
echo.

start http://localhost:5173/
npm.cmd run dev

pause
