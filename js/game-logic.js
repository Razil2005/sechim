// Game Logic
class QuizGame {
    constructor() {
        this.mode = null;
        this.category = null;
        this.items = [];
        this.currentRound = 1;
        this.currentPair = [];
        this.votes = { option1: 0, option2: 0 };
        this.votingActive = false;
        this.votingTimer = null;
    }

    // Initialize game with mode and category
    init(mode, category) {
        this.mode = mode;
        this.category = category;
        this.items = shuffleArray([...gameData[category]]);
        this.currentRound = 1;
        this.votes = { option1: 0, option2: 0 };
        this.votingActive = false;
        
        this.updateGameInfo();
        this.startNextRound();
    }

    // Update game information display
    updateGameInfo() {
        document.getElementById('remaining-count').textContent = `Remaining: ${this.items.length}`;
        document.getElementById('round-count').textContent = `Round: ${this.currentRound}`;
    }

    // Start next round
    startNextRound() {
        if (this.items.length <= 1) {
            this.showWinner();
            return;
        }

        // Get two random items
        this.currentPair = this.items.splice(0, 2);
        this.displayOptions();
        this.updateGameInfo();

        if (this.mode === 'multi') {
            this.resetVoting();
        }
    }

    // Display current options
    displayOptions() {
        if (this.mode === 'single') {
            this.displaySinglePlayerOptions();
        } else {
            this.displayMultiPlayerOptions();
        }
    }    // Display options for single player
    displaySinglePlayerOptions() {
        const option1 = document.querySelector('#option1');
        const option2 = document.querySelector('#option2');

        // Clear previous states
        option1.classList.remove('selected', 'eliminated');
        option2.classList.remove('selected', 'eliminated');

        option1.querySelector('.option-image').src = this.currentPair[0].image;
        option1.querySelector('.option-name').textContent = this.currentPair[0].name;
        
        option2.querySelector('.option-image').src = this.currentPair[1].image;
        option2.querySelector('.option-name').textContent = this.currentPair[1].name;

        // Add click handlers
        option1.onclick = () => this.selectOption(0);
        option2.onclick = () => this.selectOption(1);
    }    // Display options for multiplayer
    displayMultiPlayerOptions() {
        const option1 = document.querySelector('#multi-option1');
        const option2 = document.querySelector('#multi-option2');

        // Clear previous states
        option1.classList.remove('winner', 'loser');
        option2.classList.remove('winner', 'loser');

        option1.querySelector('.option-image').src = this.currentPair[0].image;
        option1.querySelector('.option-name').textContent = this.currentPair[0].name;
        
        option2.querySelector('.option-image').src = this.currentPair[1].image;
        option2.querySelector('.option-name').textContent = this.currentPair[1].name;
    }// Select option (single player)
    selectOption(index) {
        if (this.mode !== 'single') return;

        // Show selection feedback
        this.showSinglePlayerSelectionFeedback(index);

        // Winner stays, loser is eliminated
        const winner = this.currentPair[index];
        this.items.push(winner);
        
        // Shuffle remaining items
        this.items = shuffleArray(this.items);
        
        this.currentRound++;
        setTimeout(() => this.startNextRound(), 2000); // Increased delay to show feedback
    }

    // Show selection feedback for single player
    showSinglePlayerSelectionFeedback(selectedIndex) {
        const option1 = document.querySelector('#option1');
        const option2 = document.querySelector('#option2');
        
        // Remove click handlers to prevent multiple selections
        option1.onclick = null;
        option2.onclick = null;
        
        // Add visual feedback
        if (selectedIndex === 0) {
            option1.classList.add('selected');
            option2.classList.add('eliminated');
        } else {
            option2.classList.add('selected');
            option1.classList.add('eliminated');
        }
    }// Reset voting for multiplayer
    resetVoting() {
        this.votes = { option1: 0, option2: 0 };
        this.votingActive = true;
        this.updateVoteDisplay();
        
        // Enable vote buttons
        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.disabled = false;
            btn.textContent = 'Vote';
        });
        
        document.getElementById('vote-timer').textContent = 'Vote for your favorite option!';
        
        // Show end voting button
        const endVotingBtn = document.getElementById('end-voting');
        if (endVotingBtn) {
            endVotingBtn.style.display = 'block';
        }
    }

    // Manual end voting
    endVotingManually() {
        if (this.votes.option1 === 0 && this.votes.option2 === 0) {
            alert('Please cast at least one vote before ending the round!');
            return;
        }
        this.endVoting();
    }

    // Cast vote
    castVote(option) {
        if (!this.votingActive) return;
        
        if (option === 1) {
            this.votes.option1++;
        } else {
            this.votes.option2++;
        }
        
        this.updateVoteDisplay();
    }

    // Update vote display
    updateVoteDisplay() {
        document.querySelector('#multi-option1 .vote-count').textContent = `${this.votes.option1} votes`;
        document.querySelector('#multi-option2 .vote-count').textContent = `${this.votes.option2} votes`;
    }    // End voting and determine winner
    endVoting() {
        this.votingActive = false;
        if (this.votingTimer) {
            clearInterval(this.votingTimer);
        }
        
        // Disable vote buttons
        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.disabled = true;
            btn.textContent = 'Voting Ended';
        });
        
        // Hide end voting button
        document.getElementById('end-voting').style.display = 'none';
        
        // Determine winner
        let winnerIndex;
        let winnerText = '';
        
        if (this.votes.option1 > this.votes.option2) {
            winnerIndex = 0;
            winnerText = `${this.currentPair[0].name} wins with ${this.votes.option1} votes!`;
        } else if (this.votes.option2 > this.votes.option1) {
            winnerIndex = 1;
            winnerText = `${this.currentPair[1].name} wins with ${this.votes.option2} votes!`;
        } else {
            // Tie - random selection
            winnerIndex = Math.floor(Math.random() * 2);
            winnerText = `It's a tie! ${this.currentPair[winnerIndex].name} wins by random selection!`;
        }

        // Show visual feedback for multiplayer
        this.showMultiPlayerSelectionFeedback(winnerIndex);
        
        // Show winner announcement
        document.getElementById('vote-timer').innerHTML = `<strong style="color: #2ecc71;">${winnerText}</strong>`;
        
        // Winner stays, loser is eliminated
        const winner = this.currentPair[winnerIndex];
        this.items.push(winner);
        
        // Shuffle remaining items
        this.items = shuffleArray(this.items);
        
        this.currentRound++;
        
        // Show result for 3 seconds then continue
        setTimeout(() => {
            this.startNextRound();
        }, 3000);
    }

    // Show selection feedback for multiplayer
    showMultiPlayerSelectionFeedback(winnerIndex) {
        const option1 = document.querySelector('#multi-option1');
        const option2 = document.querySelector('#multi-option2');
        
        // Add visual feedback
        if (winnerIndex === 0) {
            option1.classList.add('winner');
            option2.classList.add('loser');
        } else {
            option2.classList.add('winner');
            option1.classList.add('loser');
        }
    }

    // Show final winner
    showWinner() {
        const winner = this.items[0];
        
        document.getElementById('winner-image').src = winner.image;
        document.getElementById('winner-name').textContent = winner.name;
        
        // Hide game screen and show winner screen
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('winner-screen').classList.remove('hidden');
    }

    // Reset game
    reset() {
        this.mode = null;
        this.category = null;
        this.items = [];
        this.currentRound = 1;
        this.currentPair = [];
        this.votes = { option1: 0, option2: 0 };
        this.votingActive = false;
        
        if (this.votingTimer) {
            clearInterval(this.votingTimer);
            this.votingTimer = null;
        }
    }
}

// Global game instance
const game = new QuizGame();
