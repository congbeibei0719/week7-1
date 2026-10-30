@echo off
title Beibei's Website - Local Server
cd /d "%~dp0"
echo.
echo  ============================================
echo   Starting your website on a local server...
echo  ============================================
echo.
echo   Address: http://localhost:8765/
echo   Your browser will open automatically.
echo.
echo   Tip: Tasks on the Projects page now persist
echo        after refresh when using this address.
echo.
echo   Press Ctrl+C in this window to stop the server.
echo.
timeout /t 1 >nul
start "" "http://localhost:8765/"
python -m http.server 8765
