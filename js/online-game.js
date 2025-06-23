// Online Game Logic
class OnlineGameManager {    constructor() {
        console.log('OnlineGameManager constructor called');
        console.log('  - Socket.IO available:', typeof io !== 'undefined');
        console.log('  - Current timestamp:', new Date().toISOString());
        
        this.socket = null;
        this.roomId = null;
        this.playerName = null;
        this.isHost = false;
        this.gameInfo = null;
        this.connected = false;
        
        // Add to window for global access
        window.onlineGame = this;
        
        this.initializeSocket();
    }    initializeSocket() {
        console.log('Initializing socket connection...');
        
        // Check if we're running via file:// protocol
        if (window.location.protocol === 'file:') {
            console.error('Cannot use online features when opening file directly!');
            alert('Online multiplayer requires a server.\n\nPlease either:\n1. Use the offline version (index-offline.html)\n2. Start the server using START_SERVER.bat\n\nFor help, see SETUP_INSTRUCTIONS.md');
            return;
        }
        
        // Check if io is available
        if (typeof io === 'undefined') {
            console.error('Socket.IO library not loaded! This usually means the server is not running.');
            console.log('Current URL protocol:', window.location.protocol);
            console.log('Current URL:', window.location.href);
            
            // Provide helpful error message
            const errorMsg = window.location.protocol === 'file:' 
                ? 'Online features require a server. Please use START_SERVER.bat or try index-offline.html for offline play.'
                : 'Server connection failed. Please ensure the server is running on port 3000.';
            
            alert(errorMsg);
            return;
        }
        
        console.log('Socket.IO library found, creating connection...');
        
        // Connect to server
        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log('Connected to server with ID:', this.socket.id);
            this.connected = true;
            this.updateConnectionStatus();
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.connected = false;
            this.updateConnectionStatus();
        });

        // Room creation response
        this.socket.on('room-created', (data) => {
            if (data.success) {
                this.roomId = data.roomId;
                this.isHost = true;
                this.gameInfo = data.gameInfo;
                this.showLobby();
            }
        });        // Join room response
        this.socket.on('join-room-response', (data) => {
            console.log('Join room response received:', data);
            if (data.success) {
                this.gameInfo = data.gameInfo;
                this.isHost = false;
                this.roomId = data.gameInfo.roomId;
                this.showLobby();
                console.log('Successfully joined room:', this.roomId);
            } else {
                console.error('Failed to join room:', data.message);
                alert(`Failed to join room: ${data.message}`);            }
        });

        // Player joined
        this.socket.on('player-joined', (data) => {
            this.gameInfo = data.gameInfo;
            this.updateLobby();
            this.updateHostControls(); // Ensure host controls are updated
            this.showNotification(`${data.player.name} joined the game!`, 'join');
        });// Player left
        this.socket.on('player-left', (data) => {
            this.gameInfo = data.gameInfo;
            this.updateLobby();            // Update host status if needed
            const currentPlayer = this.gameInfo.players.find(p => p.id === this.socket.id);
            if (currentPlayer) {
                const wasHost = this.isHost;
                this.isHost = currentPlayer.isHost;
                this.updateHostControls();
                
                // Show notification if this player became the new host
                if (!wasHost && this.isHost) {
                    this.showNotification('You are now the host!', 'info');                }
            }
            
            // Show notification when player leaves
            if (data.playerName) {
                this.showNotification(`${data.playerName} left the game`, 'leave');
            }
        });

        // Game started
        this.socket.on('game-started', (data) => {
            this.gameInfo = data.gameInfo;
            this.showOnlineCategorySelection();
        });

        // Category selected
        this.socket.on('category-selected', (data) => {
            this.gameInfo = data.gameInfo;
            this.startOnlineGameplay(data.currentPair);
            this.showNotification('Game started! Time to vote!', 'success');
        });

        // Vote cast        // Vote cast
        this.socket.on('vote-cast', (data) => {
            this.updateVoteDisplay(data.votes, data.votersByOption);
            // Show notification of who voted
            if (data.voter && data.voter !== this.playerName) {
                this.showNotification(`${data.voter} voted!`, 'vote');
            }
        });

        // Voting ended
        this.socket.on('voting-ended', (data) => {
            this.showVotingResult(data.result);
        });        // Next round
        this.socket.on('next-round', (data) => {
            this.gameInfo = data.gameInfo;
            this.startNextOnlineRound(data.currentPair);
            this.showNotification('Next round started!', 'info');
        });// Game finished
        this.socket.on('game-finished', (data) => {
            this.showOnlineWinner(data.winner);
        });

        // Game restarted
        this.socket.on('game-restarted', (data) => {
            this.gameInfo = data.gameInfo;
            this.showLobby();
            this.showNotification('Game restarted! Ready for another round!', 'success');
        });

        // Error handling
        this.socket.on('error', (data) => {
            alert(data.message);
        });
    }    // Create new room
    createRoom(playerName) {
        console.log('createRoom called with playerName:', playerName);
        console.log('Socket connected:', this.connected, 'Socket object:', this.socket);
        this.playerName = playerName;
        this.socket.emit('create-room', { playerName });
        console.log('create-room event emitted');
    }    // Join existing room
    joinRoom(playerName, roomCode) {
        console.log('joinRoom called with playerName:', playerName, 'roomCode:', roomCode);
        console.log('Socket connected:', this.connected, 'Socket object:', this.socket);
        this.playerName = playerName;
        this.socket.emit('join-room', { 
            playerName, 
            roomId: roomCode.toUpperCase() 
        });
        console.log('join-room event emitted');
    }

    // Start game (host only)
    startGame() {
        if (this.isHost) {
            this.socket.emit('start-game', { roomId: this.roomId });
        }
    }

    // Select category (host only)
    selectCategory(category) {
        if (this.isHost) {
            this.socket.emit('select-category', { 
                roomId: this.roomId, 
                category 
            });
        }
    }

    // Cast vote
    castVote(option) {
        this.socket.emit('cast-vote', { 
            roomId: this.roomId, 
            option 
        });
    }

    // End voting (host only)
    endVoting() {
        if (this.isHost) {
            this.socket.emit('end-voting', { roomId: this.roomId });
        }
    }

    // Restart game (host only)
    restartGame() {
        if (this.isHost) {
            this.socket.emit('restart-game', { roomId: this.roomId });
        }
    }    // UI Management Methods
    showLobby() {
        document.getElementById('online-setup').classList.add('hidden');
        document.getElementById('online-lobby').classList.remove('hidden');
        document.getElementById('back-btn').classList.remove('hidden');
        
        this.roomId = this.gameInfo.roomId;
        document.getElementById('room-code-display').textContent = `Room Code: ${this.roomId}`;
        
        this.updateLobby();
        this.updateHostControls();
        
        // Save state for page refresh persistence
        this.saveOnlineState('online-lobby');
    }

    updateLobby() {
        const playersContainer = document.getElementById('players-container');
        const playerCount = document.getElementById('player-count');
        
        playersContainer.innerHTML = '';
        playerCount.textContent = this.gameInfo.players.length;
        
        this.gameInfo.players.forEach(player => {
            const playerCard = document.createElement('div');
            playerCard.className = `player-card ${player.isHost ? 'host' : ''}`;
            playerCard.innerHTML = `<div class="player-name">${player.name}</div>`;
            playersContainer.appendChild(playerCard);
        });
    }    updateHostControls() {
        const startButton = document.getElementById('start-online-game');
        const waitingMessage = document.getElementById('waiting-message');
        
        if (this.isHost) {
            if (this.gameInfo.players.length >= 2) {
                startButton.classList.remove('hidden');
                startButton.textContent = `Start Game (${this.gameInfo.players.length} players)`;
                waitingMessage.classList.add('hidden');
            } else {
                startButton.classList.add('hidden');
                waitingMessage.textContent = `Need at least 2 players to start (${this.gameInfo.players.length}/2)`;
                waitingMessage.classList.remove('hidden');
            }
        } else {
            startButton.classList.add('hidden');
            waitingMessage.textContent = 'Waiting for host to start the game...';
            waitingMessage.classList.remove('hidden');
        }
    }

    showOnlineCategorySelection() {
        document.getElementById('online-lobby').classList.add('hidden');
        document.getElementById('category-selection').classList.remove('hidden');
        
        // Update category selection for online mode
        document.querySelectorAll('.category-card').forEach(card => {
            card.onclick = () => {
                if (this.isHost) {
                    this.selectCategory(card.dataset.category);
                } else {
                    alert('Only the host can select the category!');
                }
            };
        });
    }

    startOnlineGameplay(currentPair) {
        document.getElementById('category-selection').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        document.getElementById('single-player-game').classList.add('hidden');
        document.getElementById('multi-player-game').classList.add('hidden');
        
        // Show online multiplayer interface
        this.showOnlineMultiplayerInterface(currentPair);
    }    showOnlineMultiplayerInterface(currentPair) {
        // Show the existing online multiplayer interface
        document.getElementById('online-multiplayer-game').classList.remove('hidden');
        
        // Add event listeners if not already added
        if (!document.getElementById('online-multiplayer-game').hasAttribute('data-listeners-added')) {
            document.querySelectorAll('#online-multiplayer-game .vote-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const option = parseInt(btn.dataset.option);
                    this.castVote(option);
                });
            });
            
            document.getElementById('end-online-voting').addEventListener('click', () => {
                this.endVoting();
            });
            
            document.getElementById('online-multiplayer-game').setAttribute('data-listeners-added', 'true');
        }
        
        this.displayOnlineOptions(currentPair);
        this.updateGameInfo();
        
        // Show end voting button only for host
        if (this.isHost) {
            document.getElementById('end-online-voting').classList.remove('hidden');
        } else {
            document.getElementById('end-online-voting').classList.add('hidden');
        }
    }

    displayOnlineOptions(currentPair) {
        const option1 = document.querySelector('#online-option1');
        const option2 = document.querySelector('#online-option2');

        // Clear previous states
        option1.classList.remove('winner', 'loser');
        option2.classList.remove('winner', 'loser');

        option1.querySelector('.option-image').src = currentPair[0].image;
        option1.querySelector('.option-name').textContent = currentPair[0].name;
        
        option2.querySelector('.option-image').src = currentPair[1].image;
        option2.querySelector('.option-name').textContent = currentPair[1].name;
        
        // Reset vote display
        this.updateVoteDisplay({ option1: 0, option2: 0 });
    }    updateVoteDisplay(votes, votersByOption = null) {
        const totalVotes = votes.option1 + votes.option2;
        const option1Percent = totalVotes > 0 ? (votes.option1 / totalVotes) * 100 : 0;
        const option2Percent = totalVotes > 0 ? (votes.option2 / totalVotes) * 100 : 0;
        
        document.getElementById('online-option1-votes').textContent = `${votes.option1} votes`;
        document.getElementById('online-option2-votes').textContent = `${votes.option2} votes`;
        
        document.getElementById('online-vote-bar1').style.width = `${option1Percent}%`;
        document.getElementById('online-vote-bar2').style.width = `${option2Percent}%`;
        
        // Update voter names display
        if (votersByOption) {
            this.updateVoterNames('online-voters1', votersByOption.option1 || []);
            this.updateVoterNames('online-voters2', votersByOption.option2 || []);
        } else {
            // Clear voter names when no voter data provided
            this.updateVoterNames('online-voters1', []);
            this.updateVoterNames('online-voters2', []);
        }
    }

    updateGameInfo() {
        document.getElementById('remaining-count').textContent = `Remaining: ${this.gameInfo.remainingItems + 2}`;
        document.getElementById('round-count').textContent = `Round: ${this.gameInfo.currentRound}`;
    }    showVotingResult(result) {
        const option1 = document.querySelector('#online-option1');
        const option2 = document.querySelector('#online-option2');
        
        // Show visual feedback
        if (result.winnerIndex === 0) {
            option1.classList.add('winner');
            option2.classList.add('loser');
        } else {
            option2.classList.add('winner');
            option1.classList.add('loser');
        }
        
        // Create appropriate message based on whether it was a tie
        let message;
        if (result.isTie) {
            message = `It's a tie! ${result.winner.name} wins by random selection!`;
        } else {
            const winnerVotes = result.winnerIndex === 0 ? result.votes.option1 : result.votes.option2;
            const totalVotes = result.votes.option1 + result.votes.option2;
            message = `${result.winner.name} wins with ${winnerVotes} out of ${totalVotes} votes!`;
        }
        
        this.showNotification(message);
    }

    startNextOnlineRound(currentPair) {
        this.displayOnlineOptions(currentPair);
        this.updateGameInfo();
    }    showOnlineWinner(winner) {
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('winner-screen').classList.remove('hidden');
        
        document.getElementById('winner-image').src = winner.image;
        document.getElementById('winner-name').textContent = winner.name;
        
        // Update button text based on host status
        const playAgainBtn = document.getElementById('play-again');
        if (this.isHost) {
            playAgainBtn.textContent = 'Play Again';
            playAgainBtn.title = 'Start a new game with the same players';
        } else {
            playAgainBtn.textContent = 'Waiting for Host';
            playAgainBtn.title = 'Only the host can restart the game';
        }
    }

    updateConnectionStatus() {
        let statusElement = document.getElementById('online-status');
        if (!statusElement) {
            statusElement = document.createElement('div');
            statusElement.id = 'online-status';
            statusElement.className = 'online-status';
            document.body.appendChild(statusElement);
        }
        
        if (this.connected) {
            statusElement.textContent = '🟢 Online';
            statusElement.classList.remove('disconnected');
        } else {
            statusElement.textContent = '🔴 Disconnected';
            statusElement.classList.add('disconnected');
        }
    }    showNotification(message, type = 'info') {
        // Create a notification with different types and colors
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        // Define colors and icons for different notification types
        let bgColor, icon;
        switch (type) {
            case 'join':
                bgColor = 'rgba(46, 204, 113, 0.9)'; // Green
                icon = '👋';
                break;
            case 'leave':
                bgColor = 'rgba(231, 76, 60, 0.9)'; // Red
                icon = '👋';
                break;
            case 'vote':
                bgColor = 'rgba(52, 152, 219, 0.9)'; // Blue
                icon = '🗳️';
                break;
            case 'success':
                bgColor = 'rgba(46, 204, 113, 0.9)'; // Green
                icon = '✅';
                break;
            case 'info':
            default:
                bgColor = 'rgba(102, 126, 234, 0.9)'; // Purple
                icon = 'ℹ️';
                break;
        }
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 16px;">${icon}</span>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 1000;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 14px;
            font-weight: 500;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Stack notifications if multiple exist
        const existingNotifications = document.querySelectorAll('.notification');
        if (existingNotifications.length > 1) {
            notification.style.top = `${80 + (existingNotifications.length - 1) * 70}px`;
        }
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    copyRoomCode() {
        navigator.clipboard.writeText(this.roomId).then(() => {
            this.showNotification('Room code copied to clipboard!', 'success');
        });
    }
    
    saveOnlineState(currentScreen) {
        try {
            const state = {
                currentScreen: currentScreen,
                mode: 'online',
                category: null,
                roomId: this.roomId,
                playerName: this.playerName,
                isHost: this.isHost
            };
            localStorage.setItem('quizGameState', JSON.stringify(state));
        } catch (e) {
            console.log('Could not save online state:', e);
        }
    }

    disconnect() {
        // Clear state when disconnecting
        try {
            localStorage.removeItem('quizGameState');
        } catch (e) {
            console.log('Could not clear state:', e);
        }
        
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}

// Global online game manager
let onlineGame = null;

// Function to safely initialize the OnlineGameManager
function initializeOnlineGameManager() {
    console.log('Attempting to initialize OnlineGameManager...');
    
    // Check if Socket.IO is available
    if (typeof io === 'undefined') {
        console.warn('Socket.IO not available yet, will retry...');
        return false;
    }
    
    try {
        if (!onlineGame) {
            onlineGame = new OnlineGameManager();
            console.log('OnlineGameManager successfully initialized');
            
            // Make it globally accessible
            window.onlineGame = onlineGame;
            return true;
        }
    } catch (error) {
        console.error('Failed to initialize OnlineGameManager:', error);
        return false;
    }
    
    return true;
}

// Retry mechanism with exponential backoff
let initRetryCount = 0;
const maxRetries = 20; // Increased retries
const baseDelay = 100;

function retryInitialization() {
    if (onlineGame || initRetryCount >= maxRetries) {
        if (initRetryCount >= maxRetries) {
            console.error('Failed to initialize OnlineGameManager after maximum retries');
        }
        return;
    }
    
    initRetryCount++;
    console.log(`Initialization retry ${initRetryCount}/${maxRetries}`);
    
    if (initializeOnlineGameManager()) {
        console.log('OnlineGameManager initialized successfully on retry');
        return;
    }
    
    // Exponential backoff: 100ms, 200ms, 400ms, etc.
    const delay = Math.min(baseDelay * Math.pow(2, initRetryCount - 1), 2000);
    setTimeout(retryInitialization, delay);
}

// Wait for DOM to be ready before starting initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded, starting OnlineGameManager initialization...');
        setTimeout(() => {
            if (!initializeOnlineGameManager()) {
                retryInitialization();
            }
        }, 100);
    });
} else {
    // DOM is already ready
    console.log('DOM already ready, starting OnlineGameManager initialization...');
    setTimeout(() => {
        if (!initializeOnlineGameManager()) {
            retryInitialization();
        }
    }, 100);
}

// Additional window load event
window.addEventListener('load', function() {
    console.log('Window load event - checking OnlineGameManager...');
    if (!onlineGame) {
        setTimeout(() => {
            if (!initializeOnlineGameManager()) {
                retryInitialization();
            }
        }, 100);
    }
});

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

function    updateVoterNames(containerId, voterNames) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Voter container ${containerId} not found!`);
            return;
        }
        
        // Clear existing voter tags
        container.innerHTML = '';
        
        // Add voter tags for each voter (only if we have voters)
        if (voterNames && voterNames.length > 0) {
            voterNames.forEach(voterName => {
                const voterTag = document.createElement('span');
                voterTag.className = 'voter-tag';
                voterTag.textContent = voterName;
                
                // Highlight current player's vote
                if (voterName === this.playerName) {
                    voterTag.classList.add('current-player');
                }
                
                container.appendChild(voterTag);
            });
        }
        // If no voters, container remains empty (CSS will show "No votes yet")
    }
