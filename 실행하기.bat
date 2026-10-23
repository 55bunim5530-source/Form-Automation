@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if not errorlevel 1 goto node_ready
echo [ERROR] Node.js 20.9 or newer is required.
echo Install Node.js and run this file again.
pause
exit /b 1
:node_ready
node launcher\start.mjs
if errorlevel 1 pause
