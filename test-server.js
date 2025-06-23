const io = require('socket.io')(3001, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Simple test server to verify voter data
const testRoom = {
    votes: { option1: 0, option2: 0 },
    playerVotes: new Map(),
    players: new Map(),
    
    getVotersByOption() {
        const votersByOption = {
            option1: [],
            option2: []
        };
        
        for (const [playerId, option] of this.playerVotes.entries()) {
            const player = this.players.get(playerId);
            if (player) {
                if (option === 1) {
                    votersByOption.option1.push(player.name);
                } else if (option === 2) {
                    votersByOption.option2.push(player.name);
                }
            }
        }
        
        return votersByOption;
    }
};

io.on('connection', (socket) => {
    console.log('Test client connected:', socket.id);
    
    socket.on('join-test', (data) => {
        console.log('Player joined test room:', data.playerName);
        testRoom.players.set(socket.id, { name: data.playerName });
        socket.join('test-room');
        
        socket.emit('test-ready', { message: 'Ready to test voting' });
    });
    
    socket.on('test-vote', (data) => {
        console.log(`${testRoom.players.get(socket.id)?.name} voted for option ${data.option}`);
        
        // Remove previous vote
        const previousVote = testRoom.playerVotes.get(socket.id);
        if (previousVote) {
            testRoom.votes[`option${previousVote}`]--;
        }
        
        // Add new vote
        testRoom.playerVotes.set(socket.id, data.option);
        testRoom.votes[`option${data.option}`]++;
        
        const votersByOption = testRoom.getVotersByOption();
        
        console.log('Current votes:', testRoom.votes);
        console.log('Voters by option:', votersByOption);
        
        io.to('test-room').emit('vote-result', {
            votes: testRoom.votes,
            votersByOption: votersByOption,
            voter: testRoom.players.get(socket.id).name
        });
    });
    
    socket.on('disconnect', () => {
        console.log('Test client disconnected:', socket.id);
        const player = testRoom.players.get(socket.id);
        if (player) {
            console.log(`${player.name} left the test`);
            testRoom.players.delete(socket.id);
            testRoom.playerVotes.delete(socket.id);
        }
    });
});

console.log('🧪 Test server running on port 3001');
console.log('Use test-voter-client.html to test');
