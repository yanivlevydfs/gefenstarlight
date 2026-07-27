@echo off
title GefenStarlight - Dev Server
echo ====================================================
echo   Gefen Starlight  -  Next.js + Payload CMS
echo ====================================================
echo.

cd /d "%~dp0"

if not exist node_modules (
    echo [INFO] Installing dependencies. This takes a few minutes the first time...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
)

if not exist .env (
    echo [INFO] No .env found - creating one from .env.example
    copy /y .env.example .env >nul
)

echo   Website  ^(Hebrew^)   http://localhost:3001/he
echo   Website  ^(English^)  http://localhost:3001/en
echo   Admin console        http://localhost:3001/admin
echo.
echo   First time in the admin console you will be asked to
echo   create your account. That account is the site owner.
echo.
echo [INFO] Starting... the first page load takes ~30 seconds while it compiles.
echo.

call npm run dev

if errorlevel 1 (
    echo.
    echo [ERROR] Dev server stopped unexpectedly.
    pause
)
