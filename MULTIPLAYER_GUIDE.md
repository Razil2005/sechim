# Online Multiplayer Access Guide

## Overview
The quiz elimination game now supports online multiplayer where players can join from different devices and computers over the network.

## Server Setup
The server is configured to:
- ✅ Bind to all network interfaces (`0.0.0.0:3000`)
- ✅ Accept connections from external devices
- ✅ Provide real-time multiplayer functionality via WebSockets

## Network Information
Based on current server configuration:
- **Local Access**: http://localhost:3000
- **Network Access**: http://192.168.100.7:3000
- **Port**: 3000

## How to Join from Another Device

### Step 1: Find the Server IP Address
1. The server displays available network addresses when started
2. Look for the line: `- http://[IP_ADDRESS]:3000`
3. Example: `http://192.168.100.7:3000`

### Step 2: Connect from Another Device
1. Ensure both devices are on the same network (WiFi/LAN)
2. On the other device, open a web browser
3. Navigate to: `http://[SERVER_IP]:3000`
4. Example: `http://192.168.100.7:3000`

### Step 3: Join a Game
1. **Host Device** (Server computer):
   - Click "Online Multiplayer"
   - Enter your name
   - Click "Create Room"
   - Share the 6-character room code with other players

2. **Joining Device** (Other computer/phone):
   - Navigate to `http://[SERVER_IP]:3000`
   - Click "Online Multiplayer"
   - Enter your name
   - Enter the room code
   - Click "Join Room"

## Troubleshooting

### Issue: Cannot Access from Another Device
**Possible Causes & Solutions:**

1. **Firewall Blocking**:
   - Windows Firewall may block incoming connections
   - Add exception for Node.js or port 3000
   - Command: `netsh advfirewall firewall add rule name="QuizGame" dir=in action=allow protocol=TCP localport=3000`

2. **Different Network**:
   - Ensure both devices are on the same WiFi network
   - Check if devices can ping each other

3. **Antivirus Software**:
   - Some antivirus programs block network access
   - Temporarily disable or add exception

4. **Router Configuration**:
   - Some routers have device isolation enabled
   - Check router settings for "AP Isolation" or "Client Isolation"

### Issue: Room Not Found
**Possible Causes & Solutions:**

1. **Case Sensitivity**:
   - Room codes are automatically converted to uppercase
   - Ensure correct room code is entered

2. **Room Expired**:
   - Rooms may be cleaned up if host disconnects
   - Create a new room

3. **Server Connection**:
   - Verify server is still running
   - Check server logs for errors

## Testing Tools

### Test Pages Available:
1. **Join Test**: `http://localhost:3000/test-join.html`
   - Simulates multiple devices
   - Tests room creation and joining

2. **External Test**: `http://localhost:3000/test-external.html`
   - Tests external IP connectivity
   - Verifies network access

3. **Functionality Test**: `http://localhost:3000/test-functionality.html`
   - Tests basic Socket.IO connectivity
   - Verifies OnlineGameManager

## Network Commands (Windows)

### Find Your IP Address:
```powershell
ipconfig | findstr IPv4
```

### Test Network Connectivity:
```powershell
# From another device, test if server is reachable
Test-NetConnection -ComputerName 192.168.100.7 -Port 3000
```

### Add Firewall Exception:
```powershell
# Run as Administrator
netsh advfirewall firewall add rule name="QuizGame" dir=in action=allow protocol=TCP localport=3000
```

### Check Open Ports:
```powershell
netstat -an | findstr :3000
```

## Expected Behavior

### Successful Connection:
1. User navigates to `http://[SERVER_IP]:3000`
2. Page loads showing game interface
3. Socket.IO connects automatically
4. User can create/join rooms

### Server Logs Should Show:
```
Server running on port 3000
Available network addresses:
  - http://192.168.100.7:3000
User connected: [SOCKET_ID]
```

### Failed Connection Signs:
- Page doesn't load (connection refused)
- "This site can't be reached" error
- Infinite loading/timeout

## Security Considerations
- Server only accepts connections from local network
- No authentication required (intended for local multiplayer)
- Rooms are temporary and cleaned up automatically
- No persistent data storage

## For Mobile Devices
1. Connect mobile device to same WiFi network
2. Open mobile browser (Chrome, Safari, etc.)
3. Navigate to `http://[SERVER_IP]:3000`
4. Game interface is responsive and mobile-friendly

## Advanced: Port Forwarding (Optional)
If you want players from outside your local network to join:
1. Configure router port forwarding for port 3000
2. Use public IP address instead of local IP
3. ⚠️ **Security Warning**: This exposes your server to the internet

---

**Need Help?**
If joining still doesn't work:
1. Check server logs for error messages
2. Verify both devices are on same network
3. Test with test pages provided
4. Ensure firewall/antivirus isn't blocking connection
