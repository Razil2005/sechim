@echo off
echo ================================
echo   Quiz Game Server Starter
echo ================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo Then run this script again.
    pause
    exit /b 1
)

echo Node.js is installed!
echo.

echo Installing game dependencies...
npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo Starting the game server...
echo.
echo ================================
echo   Server is starting...
echo   Open your browser and go to:
echo   http://localhost:3000
echo.
echo   For other players on your network:
echo   Find your IP address and share:
echo   http://YOUR_IP:3000
echo ================================
echo.
echo Press Ctrl+C to stop the server
echo.

node server.js
