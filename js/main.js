// Main application logic
document.addEventListener('DOMContentLoaded', function() {
    console.log('Main.js DOMContentLoaded fired');
    console.log('  - Socket.IO available:', typeof io !== 'undefined');
    console.log('  - OnlineGameManager available:', typeof OnlineGameManager !== 'undefined');
    console.log('  - onlineGame instance:', typeof onlineGame, onlineGame);
    console.log('  - window.onlineGame:', typeof window.onlineGame, window.onlineGame);
    
    // State management functions
    function saveState(state) {
        try {
            localStorage.setItem('quizGameState', JSON.stringify(state));
        } catch (e) {
            console.log('Could not save state to localStorage:', e);
        }
    }
    
    function loadState() {
        try {
            const saved = localStorage.getItem('quizGameState');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.log('Could not load state from localStorage:', e);
            return null;
        }
    }
    
    function clearState() {
        try {
            localStorage.removeItem('quizGameState');
        } catch (e) {
            console.log('Could not clear state from localStorage:', e);
        }
    }
    
    // Elements
    const modeSelection = document.getElementById('mode-selection');
    const categorySelection = document.getElementById('category-selection');
    const gameScreen = document.getElementById('game-screen');
    const winnerScreen = document.getElementById('winner-screen');
    const singlePlayerGame = document.getElementById('single-player-game');
    const multiPlayerGame = document.getElementById('multi-player-game');
    const onlineSetup = document.getElementById('online-setup');
    const onlineLobby = document.getElementById('online-lobby');
    const backBtn = document.getElementById('back-btn');    let selectedMode = null;
    let selectedCategory = null;

    // Initialize state restoration
    function initializeApp() {
        const savedState = loadState();
        if (savedState) {
            console.log('Restoring saved state:', savedState);
            restoreState(savedState);
        }
    }
    
    function restoreState(state) {
        selectedMode = state.mode;
        selectedCategory = state.category;
        
        switch (state.currentScreen) {
            case 'mode-selection':
                // Already showing mode selection by default
                break;
            case 'online-setup':
                if (state.mode === 'online') {
                    showOnlineSetup();
                }
                break;
            case 'category-selection':
                if (state.mode && state.mode !== 'online') {
                    showCategorySelection();
                }
                break;
            case 'online-lobby':
                if (state.mode === 'online') {
                    showOnlineSetup(); // Will need to reconnect
                }
                break;
            case 'game-screen':
                if (state.mode && state.category) {
                    showCategorySelection();
                    // Let user manually restart the game
                }
                break;
        }
    }
    
    // Initialize the app
    initializeApp();

    // Mode selection handlers
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectedMode = this.dataset.mode;
            if (selectedMode === 'online') {
                showOnlineSetup();
            } else {
                showCategorySelection();
            }
            // Save state
            saveState({ mode: selectedMode, category: selectedCategory });
        });
    });    // Category selection handlers
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            selectedCategory = this.dataset.category;
            if (selectedMode === 'online') {
                // Online mode category selection is handled in online-game.js
                return;
            }
            startGame();
            // Save state
            saveState({ mode: selectedMode, category: selectedCategory });
        });
    });    // Online setup handlers
    document.getElementById('create-room-btn').addEventListener('click', function() {
        console.log('Create room button clicked');
        const playerName = document.getElementById('host-name').value.trim();
        console.log('Player name:', playerName);
        
        if (!playerName) {
            alert('Please enter your name');
            return;
        }
        
        // Enhanced onlineGame availability check with retry mechanism
        console.log('Checking onlineGame availability:');
        console.log('  - typeof onlineGame:', typeof onlineGame);
        console.log('  - onlineGame object:', onlineGame);
        console.log('  - window.onlineGame:', window.onlineGame);
        
        // Try to get onlineGame from window if not available
        if (!onlineGame && window.onlineGame) {
            onlineGame = window.onlineGame;
            console.log('Retrieved onlineGame from window object');
        }
          // If still not available, try to initialize
        if (typeof onlineGame === 'undefined' || !onlineGame) {
            console.log('OnlineGame not available, attempting initialization...');
            
            // Check if we're using file:// protocol
            if (window.location.protocol === 'file:') {
                console.error('File protocol detected - online features not available');
                alert('Online multiplayer is not available when opening the file directly.\n\nTo play online:\n1. Start the server using START_SERVER.bat\n2. Open http://localhost:3000 in your browser\n\nOr use index-offline.html for offline play.');
                return;
            }
            
            // Check if Socket.IO is available
            if (typeof io === 'undefined') {
                console.error('Socket.IO library not loaded');
                alert('Connection system not ready. Please refresh the page and ensure you have internet connectivity.\n\nIf this problem persists:\n1. Check that the server is running\n2. Try restarting the server\n3. Use index-offline.html for offline play');
                return;
            }
            
            // Try to initialize it manually
            try {
                if (typeof OnlineGameManager !== 'undefined') {
                    onlineGame = new OnlineGameManager();
                    window.onlineGame = onlineGame;
                    console.log('OnlineGameManager manually initialized');
                    
                    // Wait a moment for socket connection
                    setTimeout(() => {
                        if (onlineGame && onlineGame.connected) {
                            console.log('Socket connected, creating room...');
                            onlineGame.createRoom(playerName);
                        } else {
                            console.log('Waiting for socket connection...');
                            // Try again after a short delay
                            setTimeout(() => {
                                if (onlineGame) {
                                    onlineGame.createRoom(playerName);
                                } else {
                                    alert('Failed to establish connection. Please try again.');
                                }
                            }, 1000);
                        }
                    }, 500);
                    return;
                } else {
                    console.error('OnlineGameManager class not found');
                    alert('Online game system not available. Please refresh the page.');
                    return;
                }
            } catch (error) {
                console.error('Failed to initialize OnlineGameManager:', error);
                alert('Failed to initialize online system. Please refresh the page and try again.');
                return;
            }
        }
        
        // Check if the socket is connected
        if (onlineGame && !onlineGame.connected) {
            console.log('Socket not connected yet, waiting...');
            // Wait for connection
            setTimeout(() => {
                if (onlineGame.connected) {
                    console.log('Socket connected, creating room...');
                    onlineGame.createRoom(playerName);
                } else {
                    alert('Connection not established. Please check your internet connection and try again.');
                }
            }, 1000);
            return;
        }
        
        console.log('Creating room with player name:', playerName);
        onlineGame.createRoom(playerName);
    });    document.getElementById('join-room-btn').addEventListener('click', function() {
        const playerName = document.getElementById('join-name').value.trim();
        const roomCode = document.getElementById('room-code').value.trim();
        
        if (!playerName) {
            alert('Please enter your name');
            return;
        }
        if (!roomCode || roomCode.length !== 6) {
            alert('Please enter a valid 6-character room code');
            return;
        }
        
        // Enhanced onlineGame availability check
        console.log('Join room - checking onlineGame availability:');
        console.log('  - typeof onlineGame:', typeof onlineGame);
        console.log('  - window.onlineGame:', window.onlineGame);
        
        // Try to get onlineGame from window if not available
        if (!onlineGame && window.onlineGame) {
            onlineGame = window.onlineGame;
            console.log('Retrieved onlineGame from window object');
        }
          // If still not available, try to initialize
        if (typeof onlineGame === 'undefined' || !onlineGame) {
            console.log('OnlineGame not available, attempting initialization...');
            
            // Check if we're using file:// protocol
            if (window.location.protocol === 'file:') {
                console.error('File protocol detected - online features not available');
                alert('Online multiplayer is not available when opening the file directly.\n\nTo play online:\n1. Start the server using START_SERVER.bat\n2. Open http://localhost:3000 in your browser\n\nOr use index-offline.html for offline play.');
                return;
            }
            
            // Check if Socket.IO is available
            if (typeof io === 'undefined') {
                console.error('Socket.IO library not loaded');
                alert('Connection system not ready. Please refresh the page and ensure you have internet connectivity.\n\nIf this problem persists:\n1. Check that the server is running\n2. Try restarting the server\n3. Use index-offline.html for offline play');
                return;
            }
            
            try {
                if (typeof OnlineGameManager !== 'undefined') {
                    onlineGame = new OnlineGameManager();
                    window.onlineGame = onlineGame;
                    console.log('OnlineGameManager manually initialized for join');
                    
                    // Wait for connection then join
                    setTimeout(() => {
                        if (onlineGame && onlineGame.connected) {
                            onlineGame.joinRoom(playerName, roomCode);
                        } else {
                            setTimeout(() => {
                                if (onlineGame) {
                                    onlineGame.joinRoom(playerName, roomCode);
                                } else {
                                    alert('Failed to establish connection. Please try again.');
                                }
                            }, 1000);
                        }
                    }, 500);
                    return;
                } else {
                    console.error('OnlineGameManager class not found');
                    alert('Online game system not ready. Please refresh the page.');
                    return;
                }
            } catch (error) {
                console.error('Failed to initialize OnlineGameManager:', error);
                alert('Online game system failed to initialize. Please refresh the page.');
                return;
            }
        }
        
        // Check if the socket is connected
        if (onlineGame && !onlineGame.connected) {
            console.log('Socket not connected yet, waiting...');
            setTimeout(() => {
                if (onlineGame.connected) {
                    onlineGame.joinRoom(playerName, roomCode);
                } else {
                    alert('Connection not established. Please check your internet connection and try again.');
                }
            }, 1000);
            return;
        }
        
        console.log('Joining room with player name:', playerName, 'room code:', roomCode);
        onlineGame.joinRoom(playerName, roomCode);
    });// Online lobby handlers
    document.getElementById('copy-room-code').addEventListener('click', function() {
        if (typeof onlineGame === 'undefined') {
            console.error('OnlineGame not initialized');
            return;
        }
        onlineGame.copyRoomCode();
    });

    document.getElementById('start-online-game').addEventListener('click', function() {
        if (typeof onlineGame === 'undefined') {
            console.error('OnlineGame not initialized');
            return;
        }
        onlineGame.startGame();
    });// Multiplayer voting handlers
    document.querySelectorAll('.vote-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const option = parseInt(this.dataset.option);
            game.castVote(option);
        });
    });

    // End voting button
    document.getElementById('end-voting').addEventListener('click', function() {
        game.endVotingManually();
    });    // Play again button
    document.getElementById('play-again').addEventListener('click', function() {
        // Check if we're in an online game
        if (typeof onlineGame !== 'undefined' && onlineGame && onlineGame.connected && onlineGame.roomId) {
            // For online games, only host can restart
            if (onlineGame.isHost) {
                onlineGame.restartGame();
            } else {
                alert('Only the host can restart the game. Please wait for the host to restart.');
            }
        } else {
            // For offline games, go back to home
            resetToHome();
        }
    });

    // Back button
    backBtn.addEventListener('click', function() {
        goBack();
    });    // Show category selection
    function showCategorySelection() {
        modeSelection.classList.add('hidden');
        onlineSetup.classList.add('hidden');
        categorySelection.classList.remove('hidden');
        backBtn.classList.remove('hidden');
        
        // Save state
        saveState({
            currentScreen: 'category-selection',
            mode: selectedMode,
            category: selectedCategory
        });
    }

    // Show online setup
    function showOnlineSetup() {
        modeSelection.classList.add('hidden');
        categorySelection.classList.add('hidden');
        onlineSetup.classList.remove('hidden');
        backBtn.classList.remove('hidden');
        
        // Save state
        saveState({
            currentScreen: 'online-setup',
            mode: selectedMode,
            category: selectedCategory
        });
    }    // Start the game
    function startGame() {
        categorySelection.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        
        // Show appropriate game mode
        if (selectedMode === 'single') {
            singlePlayerGame.classList.remove('hidden');
            multiPlayerGame.classList.add('hidden');
        } else {
            singlePlayerGame.classList.add('hidden');
            multiPlayerGame.classList.remove('hidden');
        }
        
        // Initialize game
        game.init(selectedMode, selectedCategory);
        
        // Update game title
        const categoryName = selectedCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        document.getElementById('game-title').textContent = `Choose Your Favorite ${categoryName}`;
        
        // Save state
        saveState({
            currentScreen: 'game-screen',
            mode: selectedMode,
            category: selectedCategory
        });
    }// Go back to previous screen
    function goBack() {
        if (!gameScreen.classList.contains('hidden')) {
            // From game screen to category selection
            gameScreen.classList.add('hidden');
            categorySelection.classList.remove('hidden');
            game.reset();
        } else if (!onlineLobby.classList.contains('hidden')) {
            // From online lobby to online setup
            onlineLobby.classList.add('hidden');
            onlineSetup.classList.remove('hidden');
            if (typeof onlineGame !== 'undefined' && onlineGame.connected) {
                onlineGame.disconnect();
            }
        } else if (!onlineSetup.classList.contains('hidden')) {
            // From online setup to mode selection
            onlineSetup.classList.add('hidden');
            modeSelection.classList.remove('hidden');
            backBtn.classList.add('hidden');
            selectedMode = null;
        } else if (!categorySelection.classList.contains('hidden')) {
            // From category selection to mode selection
            categorySelection.classList.add('hidden');
            modeSelection.classList.remove('hidden');
            backBtn.classList.add('hidden');
            selectedMode = null;
        } else if (!winnerScreen.classList.contains('hidden')) {
            // From winner screen to home
            resetToHome();
        }
    }// Reset to home screen    function resetToHome() {
        // Hide all screens
        categorySelection.classList.add('hidden');
        gameScreen.classList.add('hidden');
        winnerScreen.classList.add('hidden');
        singlePlayerGame.classList.add('hidden');
        multiPlayerGame.classList.add('hidden');
        onlineSetup.classList.add('hidden');
        onlineLobby.classList.add('hidden');
        backBtn.classList.add('hidden');
        
        // Show mode selection
        modeSelection.classList.remove('hidden');
        
        // Reset game state
        game.reset();
        selectedMode = null;
        selectedCategory = null;
        
        // Clear saved state
        clearState();
        
        // Disconnect from online game if connected
        if (typeof onlineGame !== 'undefined' && onlineGame.connected) {
            onlineGame.disconnect();
        }
    }

    // Format room code input
    document.getElementById('room-code').addEventListener('input', function(e) {
        e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 6);
    });

    // Enter key support for inputs
    document.getElementById('host-name').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('create-room-btn').click();
        }
    });

    document.getElementById('join-name').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('room-code').focus();
        }
    });

    document.getElementById('room-code').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('join-room-btn').click();
        }
    });
});
