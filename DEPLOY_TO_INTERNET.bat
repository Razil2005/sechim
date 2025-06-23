@echo off
echo ================================================
echo 🚀 Internet Deployment Helper
echo ================================================
echo.
echo This will help you deploy your game to the internet!
echo.
echo Step 1: Install Railway CLI
echo ------------------------------------------------
npm install -g @railway/cli
echo.
echo Step 2: Login to Railway
echo ------------------------------------------------
echo Opening Railway login in your browser...
railway login
echo.
echo Step 3: Deploy your game
echo ------------------------------------------------
echo Deploying to Railway...
railway up
echo.
echo ================================================
echo 🎉 Deployment Complete!
echo ================================================
echo.
echo Your game should now be live on the internet!
echo Railway will show you the URL where your game is hosted.
echo.
echo Share that URL with friends to play together online!
echo ================================================
pause
