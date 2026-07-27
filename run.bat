@echo off
title GefenStarlight Development Server
echo ===================================================
echo   GefenStarlight - Next.js Development Environment  
echo ===================================================
echo.

if not exist node_modules (
    echo [INFO] node_modules not found. Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
)

echo [INFO] Starting Next.js dev server on http://localhost:3000 ...
echo.
call npm run dev

if errorlevel 1 (
    echo [ERROR] Dev server stopped unexpectedly.
    pause
)
