@echo off
echo ================================
echo   Quiz Game Distribution Creator
echo ================================
echo.

set "game_name=QuizEliminationGame"
set "zip_name=%game_name%_v1.0.zip"

echo Creating distribution package...
echo.

REM Create a temporary directory for clean packaging
if exist "temp_dist" rmdir /s /q "temp_dist"
mkdir "temp_dist"

echo Copying main game files...
copy "index.html" "temp_dist\" >nul
copy "index-offline.html" "temp_dist\" >nul
copy "server.js" "temp_dist\" >nul
copy "package.json" "temp_dist\" >nul
copy "START_SERVER.bat" "temp_dist\" >nul

echo Copying documentation...
copy "README.md" "temp_dist\" >nul
copy "SETUP_INSTRUCTIONS.md" "temp_dist\" >nul
copy "DISTRIBUTION_GUIDE.md" "temp_dist\" >nul
copy "add-firewall-rule.bat" "temp_dist\" >nul

echo Copying game assets...
xcopy "js" "temp_dist\js\" /E /I /Y >nul
xcopy "css" "temp_dist\css\" /E /I /Y >nul
xcopy "images" "temp_dist\images\" /E /I /Y >nul

echo.
echo Files copied to temp_dist folder.
echo.

REM Check if PowerShell is available for compression
powershell -command "Get-Command Compress-Archive" >nul 2>&1
if %errorlevel% equ 0 (
    echo Creating ZIP file using PowerShell...
    powershell -command "Compress-Archive -Path 'temp_dist\*' -DestinationPath '%zip_name%' -Force"
    if exist "%zip_name%" (
        echo.
        echo ✅ SUCCESS! Distribution package created: %zip_name%
        echo.
        echo The package includes:
        echo   - Main game files
        echo   - Offline version
        echo   - Server files
        echo   - Complete documentation
        echo   - All game assets
        echo.
        echo You can now share %zip_name% with others!
    ) else (
        echo ❌ Failed to create ZIP file
    )
) else (
    echo.
    echo ⚠️  PowerShell compression not available.
    echo   Files are ready in 'temp_dist' folder.
    echo   Please manually create a ZIP file from the temp_dist contents.
)

echo.
echo Cleaning up temporary files...
if exist "temp_dist" rmdir /s /q "temp_dist"

echo.
echo ================================
echo   Distribution package ready!
echo ================================
pause
