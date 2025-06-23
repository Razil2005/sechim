const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
const os = require('os');

const app = express();
const server = http.createServer(app);

// Configure Socket.IO for internet deployment
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow all origins for internet access
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling'], // Support both transport methods
    pingTimeout: 60000, // Increase timeout for slower connections
    pingInterval: 25000, // Ping more frequently for internet connections
    upgradeTimeout: 30000,
    maxHttpBufferSize: 1e6
});

// Middleware
app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(express.static('.'));

// Health check endpoint for deployment platforms
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        activeRooms: gameRooms.size,
        uptime: process.uptime()
    });
});

// Game rooms storage
const gameRooms = new Map();

class OnlineGameRoom {
    constructor(roomId, hostId) {
        this.roomId = roomId;
        this.hostId = hostId;
        this.players = new Map();
        this.gameState = 'waiting'; // waiting, category-selection, playing, finished
        this.category = null;
        this.items = [];
        this.currentPair = [];
        this.currentRound = 1;
        this.votes = { option1: 0, option2: 0 };
        this.playerVotes = new Map(); // Track who voted for what
        this.votingActive = false;
        this.maxPlayers = 10;
    }

    addPlayer(playerId, playerName) {
        if (this.players.size >= this.maxPlayers) {
            return false;
        }
        
        this.players.set(playerId, {
            id: playerId,
            name: playerName,
            isHost: playerId === this.hostId,
            connected: true
        });
        return true;
    }    removePlayer(playerId) {
        const player = this.players.get(playerId);
        this.players.delete(playerId);
        this.playerVotes.delete(playerId);
        
        // If host leaves, assign new host
        if (playerId === this.hostId && this.players.size > 0) {
            this.hostId = this.players.keys().next().value;
            this.players.get(this.hostId).isHost = true;
        }
        
        return player; // Return player info for notifications
    }

    castVote(playerId, option) {
        if (!this.votingActive) return false;
        
        // Remove previous vote if exists
        const previousVote = this.playerVotes.get(playerId);
        if (previousVote) {
            if (previousVote === 1) this.votes.option1--;
            else this.votes.option2--;
        }
        
        // Add new vote
        this.playerVotes.set(playerId, option);
        if (option === 1) this.votes.option1++;
        else this.votes.option2++;
        
        return true;
    }

    startVoting() {
        this.votingActive = true;
        this.votes = { option1: 0, option2: 0 };
        this.playerVotes.clear();
    }    endVoting() {
        this.votingActive = false;
        
        // Determine winner
        let winnerIndex;
        let isTie = false;
        
        if (this.votes.option1 > this.votes.option2) {
            winnerIndex = 0;
        } else if (this.votes.option2 > this.votes.option1) {
            winnerIndex = 1;
        } else {
            // Tie - random selection
            isTie = true;
            winnerIndex = Math.floor(Math.random() * 2);
        }
        
        // Winner stays, loser is eliminated
        const winner = this.currentPair[winnerIndex];
        this.items.push(winner);
        
        // Shuffle remaining items
        this.items = this.shuffleArray(this.items);
        this.currentRound++;
        
        return {
            winnerIndex,
            winner,
            votes: this.votes,
            isTie
        };
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    startNextRound() {
        if (this.items.length <= 1) {
            this.gameState = 'finished';
            return { isGameFinished: true, winner: this.items[0] };
        }

        // Get two items for comparison
        this.currentPair = this.items.splice(0, 2);
        return { isGameFinished: false, pair: this.currentPair };
    }

    getGameInfo() {
        return {
            roomId: this.roomId,
            gameState: this.gameState,
            category: this.category,
            currentRound: this.currentRound,
            remainingItems: this.items.length,
            currentPair: this.currentPair,
            votes: this.votes,
            votingActive: this.votingActive,
            players: Array.from(this.players.values())
        };
    }

    // Reset game state to allow playing again
    resetGame() {
        this.gameState = 'waiting';
        this.category = null;
        this.items = [];
        this.currentPair = [];
        this.currentRound = 1;
        this.votes = { option1: 0, option2: 0 };
        this.playerVotes.clear();
        this.votingActive = false;
    }
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Create game room
    socket.on('create-room', (data) => {
        const roomId = generateRoomId();
        const room = new OnlineGameRoom(roomId, socket.id);
        room.addPlayer(socket.id, data.playerName);
        
        gameRooms.set(roomId, room);
        socket.join(roomId);
        
        socket.emit('room-created', {
            success: true,
            roomId: roomId,
            gameInfo: room.getGameInfo()
        });
        
        console.log(`Room ${roomId} created by ${data.playerName}`);
    });    // Join game room
    socket.on('join-room', (data) => {
        console.log(`Join room request received:`);
        console.log(`  - Player Name: ${data.playerName}`);
        console.log(`  - Room ID: ${data.roomId}`);
        console.log(`  - Socket ID: ${socket.id}`);
        console.log(`Available rooms: ${Array.from(gameRooms.keys())}`);
        
        const room = gameRooms.get(data.roomId);
        
        if (!room) {
            console.log(`❌ Room ${data.roomId} not found`);
            console.log(`Available rooms:`, Array.from(gameRooms.keys()));
            socket.emit('join-room-response', {
                success: false,
                message: `Room ${data.roomId} not found. Available rooms: ${Array.from(gameRooms.keys()).join(', ') || 'None'}`
            });
            return;
        }
        
        console.log(`✅ Room ${data.roomId} found`);
        console.log(`Room state: ${room.gameState}`);
        console.log(`Current players: ${room.players.size}/${room.maxPlayers}`);
        
        if (room.gameState !== 'waiting') {
            console.log(`❌ Room ${data.roomId} game already in progress`);
            socket.emit('join-room-response', {
                success: false,
                message: 'Game already in progress'
            });
            return;
        }
        
        const added = room.addPlayer(socket.id, data.playerName);
        if (!added) {
            console.log(`❌ Room ${data.roomId} is full`);
            socket.emit('join-room-response', {
                success: false,
                message: 'Room is full'
            });
            return;
        }
        
        socket.join(data.roomId);
        
        socket.emit('join-room-response', {
            success: true,
            gameInfo: room.getGameInfo()
        });
        
        // Notify other players
        socket.to(data.roomId).emit('player-joined', {
            player: room.players.get(socket.id),
            gameInfo: room.getGameInfo()
        });
          console.log(`✅ ${data.playerName} joined room ${data.roomId} successfully`);
    });

    // Start game (host only)
    socket.on('start-game', (data) => {
        const room = gameRooms.get(data.roomId);
        
        if (!room || room.hostId !== socket.id) {
            socket.emit('error', { message: 'Only host can start the game' });
            return;
        }
        
        if (room.players.size < 2) {
            socket.emit('error', { message: 'Need at least 2 players to start' });
            return;
        }
        
        room.gameState = 'category-selection';
        
        io.to(data.roomId).emit('game-started', {
            gameInfo: room.getGameInfo()
        });
    });    // Select category (host only)
    socket.on('select-category', (data) => {
        const room = gameRooms.get(data.roomId);
        
        if (!room || room.hostId !== socket.id) {
            socket.emit('error', { message: 'Only host can select category' });
            return;
        }
        
        // Load game data
        const { gameData } = require('./js/data.js');
        
        room.category = data.category;
        room.items = room.shuffleArray([...gameData[data.category]]);
        room.gameState = 'playing';
        
        const roundResult = room.startNextRound();
        if (!roundResult.isGameFinished) {
            room.startVoting();
        }
        
        io.to(data.roomId).emit('category-selected', {
            gameInfo: room.getGameInfo(),
            currentPair: room.currentPair
        });
    });

    // Cast vote
    socket.on('cast-vote', (data) => {
        const room = gameRooms.get(data.roomId);
        
        if (!room || !room.votingActive) {
            socket.emit('error', { message: 'Voting not active' });
            return;
        }
        
        const voted = room.castVote(socket.id, data.option);
        if (voted) {
            io.to(data.roomId).emit('vote-cast', {
                votes: room.votes,
                voter: room.players.get(socket.id).name
            });
        }
    });

    // End voting (host only)
    socket.on('end-voting', (data) => {
        const room = gameRooms.get(data.roomId);
        
        if (!room || room.hostId !== socket.id) {
            socket.emit('error', { message: 'Only host can end voting' });
            return;
        }
        
        if (!room.votingActive) {
            socket.emit('error', { message: 'Voting not active' });
            return;
        }
        
        const result = room.endVoting();
        
        io.to(data.roomId).emit('voting-ended', {
            result: result,
            gameInfo: room.getGameInfo()
        });
        
        // Start next round after delay
        setTimeout(() => {
            const nextRound = room.startNextRound();
            
            if (nextRound.isGameFinished) {
                room.gameState = 'finished';
                io.to(data.roomId).emit('game-finished', {
                    winner: nextRound.winner,
                    gameInfo: room.getGameInfo()
                });
            } else {
                room.startVoting();
                io.to(data.roomId).emit('next-round', {
                    gameInfo: room.getGameInfo(),
                    currentPair: room.currentPair
                });
            }
        }, 3000);
    });

    // Get room info
    socket.on('get-room-info', (data) => {
        const room = gameRooms.get(data.roomId);
        if (room) {
            socket.emit('room-info', room.getGameInfo());
        } else {
            socket.emit('error', { message: 'Room not found' });
        }
    });

    // Restart game (host only)
    socket.on('restart-game', (data) => {
        const room = gameRooms.get(data.roomId);
        
        if (!room || room.hostId !== socket.id) {
            socket.emit('error', { message: 'Only host can restart the game' });
            return;
        }
        
        if (room.gameState !== 'finished') {
            socket.emit('error', { message: 'Game is not finished yet' });
            return;
        }
        
        room.resetGame();
        
        // Notify all players that the game has been restarted
        io.to(data.roomId).emit('game-restarted', {
            gameInfo: room.getGameInfo()
        });
        
        console.log(`Game restarted in room ${data.roomId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
          // Remove player from all rooms
        for (const [roomId, room] of gameRooms.entries()) {
            if (room.players.has(socket.id)) {
                const removedPlayer = room.removePlayer(socket.id);
                
                // Notify other players
                socket.to(roomId).emit('player-left', {
                    playerId: socket.id,
                    playerName: removedPlayer ? removedPlayer.name : null,
                    gameInfo: room.getGameInfo()
                });
                
                // Remove empty rooms
                if (room.players.size === 0) {
                    gameRooms.delete(roomId);
                    console.log(`Room ${roomId} deleted - no players left`);
                }
                break;
            }
        }
    });
});

// Utility functions
function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Clean up disconnected players periodically
setInterval(() => {
    gameRooms.forEach((room, roomId) => {
        if (room.players.size === 0) {
            console.log(`Removing empty room: ${roomId}`);
            gameRooms.delete(roomId);
        }
    });
}, 30000); // Clean every 30 seconds

// Start server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0'; // Bind to all network interfaces

server.listen(PORT, HOST, () => {
    console.log('🎮 Quiz Elimination Game Server Started!');
    console.log('=====================================');
    console.log(`Port: ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Local Access: http://localhost:${PORT}`);
    
    // Display network addresses for local deployment
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        console.log('\nLocal Network Access:');
        const networkInterfaces = os.networkInterfaces();
        Object.keys(networkInterfaces).forEach((interfaceName) => {
            networkInterfaces[interfaceName].forEach((iface) => {
                if (iface.family === 'IPv4' && !iface.internal) {
                    console.log(`  - http://${iface.address}:${PORT}`);
                }
            });
        });
    }
    
    console.log('\n📡 For Internet Access:');
    console.log('Deploy to Railway, Heroku, or similar service');
    console.log('=====================================\n');
});
