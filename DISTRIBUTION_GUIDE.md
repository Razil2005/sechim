# 🎮 Quiz Elimination Game - Distribution Package

## 📋 What's Included

This package contains everything needed to run the Quiz Elimination Game in multiple ways:

### 📁 Main Files
- `index.html` - Full online multiplayer version (requires server)
- `index-offline.html` - Offline version (no server needed)
- `START_SERVER.bat` - One-click server starter for Windows
- `server.js` - Node.js server for online multiplayer

### 📁 Setup Files
- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `README.md` - Complete game documentation
- `package.json` - Dependencies configuration

### 📁 Game Assets
- `js/` - Game logic and functionality
- `css/` - Styling and visual effects
- `images/` - Game images organized by category

### 📁 Test Files (Optional)
- Various test files for debugging (can be ignored by end users)

---

## 🚀 Quick Start Guide

### Option 1: Offline Play (Easiest)
**Best for single computer, no setup required**

1. Extract all files to a folder
2. Double-click `index-offline.html`
3. Play immediately!

**Features:**
- ✅ Single player mode
- ✅ Local multiplayer (same device)
- ❌ Online multiplayer

### Option 2: Online Multiplayer (Full Features)
**Best for playing with friends on different devices**

#### First Time Setup:
1. **Install Node.js**
   - Download from: https://nodejs.org/
   - Install with default settings
   - Restart computer after installation

2. **Start the Game**
   - Extract all files to a folder
   - Double-click `START_SERVER.bat`
   - Wait for "Server running on port 3000" message
   - Open browser to: `http://localhost:3000`

#### For Friends to Join:
1. Find your computer's IP address:
   - Open Command Prompt
   - Type: `ipconfig`
   - Look for "IPv4 Address" (e.g., 192.168.1.100)

2. Share the URL with friends:
   - Format: `http://YOUR_IP_ADDRESS:3000`
   - Example: `http://192.168.1.100:3000`

3. Create a room and share the 6-character room code

**Features:**
- ✅ Single player mode
- ✅ Local multiplayer
- ✅ Online multiplayer
- ✅ Real-time voting
- ✅ Multiple players from different devices

---

## 🛠️ Troubleshooting

### "Connection system not ready" Error
**Cause:** Opening `index.html` directly instead of through the server

**Solutions:**
1. Use `index-offline.html` for offline play, OR
2. Use `START_SERVER.bat` then open `http://localhost:3000`

### Can't Connect from Another Computer
**Possible causes and solutions:**

1. **Firewall Issues**
   - Windows may ask to allow Node.js through firewall → Click "Allow"
   - Run `add-firewall-rule.bat` as administrator if needed

2. **Network Issues**
   - Ensure both computers are on the same WiFi/LAN network
   - Try disabling VPN if active

3. **Server Not Running**
   - Make sure `START_SERVER.bat` is still running
   - Look for "Server running on port 3000" message

4. **Wrong IP Address**
   - Double-check the IP address with `ipconfig`
   - Try `http://localhost:3000` on the host computer first

### Node.js Not Installed
**Error:** "node is not recognized as an internal or external command"

**Solution:**
1. Download Node.js from https://nodejs.org/
2. Install with default settings
3. Restart computer
4. Try `START_SERVER.bat` again

---

## 🎯 Game Instructions

### How to Play
1. Choose game mode (Single, Local Multiplayer, or Online)
2. Select a category (Friends, Movies, Countries, etc.)
3. Vote for your favorite between two options
4. Continue until only one item remains
5. Celebrate the winner! 🎉

### Categories Available
- 👫 Friends
- 👨‍🏫 Teachers
- 🌍 Countries
- 🎬 Movies
- 📚 Books
- ⚽ Football Players
- 🏆 Football Clubs
- 🍎 Fruits
- 🎵 Songs
- 🎓 Universities
- 🏙️ Cities
- 🐾 Animals
- 🚗 Cars
- 🎮 Games
- 🍕 Food
- 💻 Programming Languages

---

## 📞 Support

If you encounter any issues:

1. **Check the console** - Press F12 in your browser and look at the Console tab for error messages
2. **Try offline version** - Use `index-offline.html` if online features aren't working
3. **Restart everything** - Close browsers, stop server, restart `START_SERVER.bat`
4. **Check network** - Ensure all devices are on the same network

---

## 🎊 Have Fun!

Enjoy playing the Quiz Elimination Game with your friends and family! 

The game supports hundreds of items across multiple categories, providing hours of entertainment as you discover what everyone's true favorites are.

**Pro tip:** The online multiplayer mode is perfect for parties, family gatherings, or remote game nights with friends!
