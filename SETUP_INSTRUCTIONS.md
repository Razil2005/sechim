# Quiz Game Setup Instructions

## For Windows Users

### Step 1: Install Node.js
1. Download Node.js from https://nodejs.org/
2. Install it with default settings
3. Restart your computer after installation

### Step 2: Setup the Game
1. Extract the zip file to a folder (e.g., Desktop)
2. Open Command Prompt or PowerShell
3. Navigate to the game folder:
   ```
   cd "path\to\your\game\folder"
   ```
4. Install dependencies:
   ```
   npm install
   ```
5. Start the server:
   ```
   node server.js
   ```

### Step 3: Play the Game
1. Keep the command window open (this is your server)
2. Open your web browser
3. Go to: `http://localhost:3000`
4. Create or join a room!

### For Other Players to Join
- Other players on the same network can join using your computer's IP address
- Find your IP: `ipconfig` in Command Prompt
- They visit: `http://YOUR_IP_ADDRESS:3000`
- Example: `http://192.168.1.100:3000`

## Troubleshooting
- Make sure Windows Firewall allows Node.js
- Both computers must be on the same network (WiFi/LAN)
- Only one person needs to run the server
