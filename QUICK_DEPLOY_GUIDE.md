# 🌐 Deploy Your Game to the Internet - Simple Guide

## Quick Start (3 Steps)

### Option A: Use the Deployment Script (Easiest)
1. **Double-click** `DEPLOY_TO_INTERNET.bat`
2. **Follow the prompts** - it will install Railway CLI and deploy automatically
3. **Share the URL** - Railway will give you a URL like `https://your-game.railway.app`

### Option B: Manual Deployment (Step by Step)

#### Method 1: Railway (Recommended - Free)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub (free)

2. **Install Railway CLI**
   ```powershell
   npm install -g @railway/cli
   ```

3. **Login to Railway**
   ```powershell
   railway login
   ```

4. **Deploy Your Game**
   ```powershell
   # Navigate to your game folder
   cd "c:\Users\Razil\Desktop\secimupdated"
   
   # Deploy to Railway
   railway up
   ```

5. **Get Your URL**
   - Railway will automatically give you a URL like `https://your-game.railway.app`
   - Share this URL with friends to play together!

#### Method 2: Render (Alternative - Also Free)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up (free)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo OR upload your folder

3. **Configure Service**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - Click "Create Web Service"

4. **Get Your URL**
   - Render will give you a URL like `https://your-game.onrender.com`

## 🎮 How to Play After Deployment

1. **Host Creates Room:**
   - Go to your deployed URL
   - Click "Create Room"
   - Share the 6-character room code with friends

2. **Friends Join:**
   - Friends go to the same URL
   - Click "Join Room"
   - Enter the room code

3. **Play Together:**
   - Host selects category and starts voting
   - Everyone votes on their favorite options
   - Play until one item wins!

## 🔧 Troubleshooting

- **If deployment fails:** Make sure you have Node.js installed
- **If friends can't connect:** Double-check you're sharing the correct URL
- **If voting doesn't work:** Try refreshing the page

## 📱 Works On All Devices

Your deployed game works on:
- ✅ Computers (Windows, Mac, Linux)
- ✅ Phones (iPhone, Android)
- ✅ Tablets (iPad, Android tablets)
- ✅ Any device with a web browser!

## 🌍 Global Play

Once deployed, players can join from:
- ✅ Different countries
- ✅ Different WiFi networks
- ✅ Mobile data connections
- ✅ School/work networks
- ✅ Anywhere with internet!

---

**Ready to deploy? Run `DEPLOY_TO_INTERNET.bat` or follow the manual steps above!**
