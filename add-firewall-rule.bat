@echo off
echo Adding Windows Firewall exception for Quiz Game (Port 3000)
echo This requires Administrator privileges...
echo.

netsh advfirewall firewall add rule name="QuizGameServer" dir=in action=allow protocol=TCP localport=3000

if %errorlevel% equ 0 (
    echo.
    echo ✅ Firewall rule added successfully!
    echo The Quiz Game server is now accessible from other devices on your network.
    echo.
    echo To access from another device, use: http://[YOUR_IP]:3000
    echo To find your IP, run: ipconfig
    echo.
) else (
    echo.
    echo ❌ Failed to add firewall rule.
    echo Please run this batch file as Administrator.
    echo Right-click on add-firewall-rule.bat and select "Run as administrator"
    echo.
)

pause
