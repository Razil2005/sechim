# Quiz Elimination Game

A fun elimination-style quiz game where players choose their favorites from various categories until only one winner remains!

## 🎮 Game Modes

- **Single Player**: Play against the computer
- **Local Multiplayer**: Take turns on the same device
- **Online Multiplayer**: Play with friends over the internet

## 📦 Two Ways to Play

### Option 1: Full Online Version (Recommended)
**Supports all features including online multiplayer**

#### For the Host Computer:
1. **Install Node.js** from https://nodejs.org/
2. **Extract** the game files to a folder
3. **Double-click** `START_SERVER.bat` (or follow manual steps below)
4. **Open browser** and go to `http://localhost:3000`

#### Manual Steps (if batch file doesn't work):
```bash
# Open Command Prompt/PowerShell in the game folder
npm install
node server.js
```

#### For Other Players:
- Ask the host for their computer's IP address
- Open browser and go to `http://HOST_IP_ADDRESS:3000`
- Join the room with the provided room code

### Option 2: Offline Version (Simple)
**Only supports single-player and local multiplayer**

1. **Extract** the game files
2. **Double-click** `index-offline.html`
3. **Play** directly in your browser (no server needed)

## 🌐 Network Requirements

- **Same Network**: All players must be on the same WiFi/LAN
- **Firewall**: Windows may ask to allow Node.js through firewall (click "Allow")
- **Port**: The game uses port 3000

### Categories
- Friends, Teachers, Countries, Movies, Books
- Football Players, Football Clubs, Fruits, Songs
- Universities, Cities, Animals, Cars, Games
- Food, Programming Languages

## How to Play Online

### Starting the Server
1. Open a terminal/command prompt
2. Navigate to the game folder
3. Run: `npm install` (first time only)
4. Run: `npm start`
5. The server will start at `http://localhost:3000`

### Creating a Room
1. Select "Online Multiplayer"
2. Choose "Create New Room"
3. Enter your name
4. Click "Create Room"
5. Share the 6-character room code with friends

### Joining a Room
1. Select "Online Multiplayer"
2. Choose "Join Existing Room"
3. Enter your name and the room code
4. Click "Join Room"

### Playing
1. Wait for the host to start the game
2. Host selects a category
3. Everyone votes for their favorite option
4. Host can end voting or let it continue
5. The option with more votes advances
6. Continue until only one item remains!

## Technical Details

### Built With
- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express, Socket.IO
- **Real-time Communication**: WebSockets

### Features
- Real-time voting with live updates
- Visual feedback for eliminated options
- Mobile-friendly responsive design
- Automatic room cleanup when empty
- Host migration if host leaves
- Connection status indicators

## Network Setup

### Playing on Local Network
- Host starts the server on their computer
- Other players connect using host's IP address
- Example: `http://192.168.1.100:3000`

### Playing Over Internet
- Deploy to a cloud service (Heroku, Railway, etc.)
- Or use port forwarding on your router
- Share the public URL with friends

## Troubleshooting

### Can't Connect?
- Make sure the server is running
- Check firewall settings
- Verify IP address and port
- Try refreshing the browser

### Game Issues?
- Refresh the page and rejoin
- Check browser console for errors
- Make sure all players are on the same version

Have fun playing! 🎮
