@echo off
chcp 65001 >nul
cd /d "%~dp0"
node launcher\stop.mjs
timeout /t 2 >nul
