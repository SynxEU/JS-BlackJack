const suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
const weights = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
let deck, players, dealerHand = [], playerCount, currentPlayer = 0, gameRunning = false, dealerTurnStarted = false;

//#region Classes
class Player {
    constructor(name, id, points, hand, splithand){
        this.Name = name;
        this.ID = id;
        this.Points = points;
        this.Hand = hand;
        this.SplitHand = splithand;
    }
}

class Card {
    constructor(value, suit, weight){
        this.Value = value;
        this.Suit = suit;
        this.Weight = weight;
    }
}
//#endregion

function startGame(amount) {
    createDeck();
    shuffleCards();
    createPlayers(amount);
    dealerHand = [dealCards({ Hand: [] }), dealCards({ Hand: [] })];
    players.forEach(player => {
        dealCards(player);
        dealCards(player);
        player.Points = calculateHandValue(player.Hand);
    });
    currentPlayer = 0;
    gameRunning = true;
    dealerTurnStarted = false;
    toggleButtons();
    renderGame();
}

//#region Deck
function createDeck() {
    deck = [];
    for (let d = 0; d < 3; d++) {
        for (let i = 0; i < values.length; i++) {
            for (let x = 0; x < suits.length; x++) {
                deck.push(new Card(values[i], suits[x], weights[i]));
            }
        }
    }
}

function shuffleCards() {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}
//#endregion

//#region Player
function createPlayers(amount) {
    players = [];
    for (let i = 1; i <= amount; i++) {
        players.push(new Player(`Player ${i}`, i, 0, [], []));
    }
}

function dealCards(player, isSplit = false) {
    let card = deck.pop();
    if (isSplit) {
        player.SplitHand.push(card);
    } else {
        player.Hand.push(card);
    }
    return card;
}

function calculateHandValue(hand) {
    let value = 0, aceCount = 0;
    hand.forEach(card => {
        value += card.Weight;
        if (card.Value === "A") aceCount++;
    });
    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount--;
    }
    return value;
}
//#endregion

function dealerTurn() {
    dealerTurnStarted = true;
    while (calculateHandValue(dealerHand) < 17) {
        dealCards({ Hand: dealerHand });
    }
    determineWinner();
    gameRunning = false;
    toggleButtons();
    renderGame();
}

//#region Choose winner
function determineWinner() {
    let dealerValue = calculateHandValue(dealerHand);
    let resultsContainer = document.querySelector('#result');

    // Clear any previous results
    resultsContainer.innerHTML = '';

    // Define a function to determine outcome based on conditions
    const checkOutcome = (playerValue, playerType, playerName) => {
        let conditionMappings = [
            { condition: playerValue > 21, result: `${playerName} (${playerType}) busts with ${playerValue}. Dealer wins.` },
            { condition: dealerValue > 21, result: `${playerName} (${playerType}) wins with ${playerValue}! Dealer busts with ${dealerValue}.` },
            { condition: playerValue > dealerValue, result: `${playerName} (${playerType}) wins with ${playerValue} against dealer's ${dealerValue}.` },
            { condition: playerValue === dealerValue && playerValue !== 21, result: `${playerName} (${playerType}) draws with the dealer. Both have ${playerValue}.` },
            { condition: playerValue < dealerValue, result: `${playerName} (${playerType}) loses with ${playerValue} against dealer's ${dealerValue}.` },
            { condition: playerValue === 21 && playerValue === dealerValue, result: `${playerName} (${playerType}) wins with ${playerValue}. Dealer loses` },
        ];

        // Find the first matching condition and return the result
        for (let mapping of conditionMappings) {
            if (mapping.condition) return mapping.result;
        }
    };

    players.forEach(player => {
        let playerValue = calculateHandValue(player.Hand);
        let playerSplitValue = player.SplitHand.length > 0 ? calculateHandValue(player.SplitHand) : null;

        // Check outcome for main hand
        let mainHandResult = checkOutcome(playerValue, 'main hand', player.Name);
        let mainHandElement = document.createElement('p');
        mainHandElement.textContent = mainHandResult;
        resultsContainer.appendChild(mainHandElement);

        // Check outcome for split hand (if applicable)
        if (playerSplitValue !== null) {
            let splitHandResult = checkOutcome(playerSplitValue, 'split hand', player.Name);
            let splitHandElement = document.createElement('p');
            splitHandElement.textContent = splitHandResult;
            resultsContainer.appendChild(splitHandElement);
        }
    });
    updateDeckCount();
}
//#endregion

//#region Render Game
function renderGame() {
    const dealerDiv = document.querySelector('#dealer-hand .cards');
    dealerDiv.innerHTML = '';
    
    // Show dealer's first card hidden, reveal all if it's dealer's turn
    if (dealerTurnStarted) {
        dealerHand.forEach(card => {
            const img = document.createElement('img');
            img.src = `Card_Pictures/${card.Value}_of_${card.Suit}.png`;
            dealerDiv.appendChild(img);
        });
    } else {
        const cardBackImg = document.createElement('img');
        cardBackImg.src = `Card_Pictures/Card_Back.png`;
        dealerDiv.appendChild(cardBackImg);
        dealerHand.slice(1).forEach(card => {
            const img = document.createElement('img');
            img.src = `Card_Pictures/${card.Value}_of_${card.Suit}.png`;
            dealerDiv.appendChild(img);
        });
    }

    const playerDiv = document.querySelector('#player-hands .cards');
    playerDiv.innerHTML = '';

    // Only show the current player's hand
    const currentPlayerObj = players[currentPlayer];
    const handDiv = document.createElement('div');
    handDiv.innerHTML = `<h3>${currentPlayerObj.Name}: ${currentPlayerObj.Points} points</h3>`;
    
    currentPlayerObj.Hand.forEach(card => {
        const img = document.createElement('img');
        img.src = `Card_Pictures/${card.Value}_of_${card.Suit}.png`;
        handDiv.appendChild(img);
    });

    // Shows the player's split hand if it exists
    if (currentPlayerObj.SplitHand.length > 0) {
        handDiv.innerHTML += `<h4>${currentPlayerObj.Name}'s Split Hand: ${calculateHandValue(currentPlayerObj.SplitHand)} points</h4>`;
        currentPlayerObj.SplitHand.forEach(card => {
            const img = document.createElement('img');
            img.src = `Card_Pictures/${card.Value}_of_${card.Suit}.png`;
            handDiv.appendChild(img);
        });
    }

    playerDiv.appendChild(handDiv);

    updateDeckCount();
    document.querySelector('#result').textContent = '';
}
//#endregion

//#region Document
function updateDeckCount() {
    document.getElementById('deck-number').textContent = deck.length;
}

document.getElementById('start').addEventListener('click', () => {
    playerCount = parseInt(document.getElementById('player-count').value);
    if (isNaN(playerCount) || playerCount <= 0 || playerCount > 8) {
        alert("Please enter a valid number of players (1-8).");
        return;
    }
    startGame(playerCount);
});

document.getElementById('hit').addEventListener('click', () => {
    let currentPlayerHand = players[currentPlayer].Hand;
    let splitHand = players[currentPlayer].SplitHand;

    if (currentPlayerHand === 7) {
        alert("You can't draw anymore cards")
        currentPlayer++;
            if (currentPlayer >= players.length) {
                dealerTurn();
            } else {
                renderGame();
            }
    }

    if (splitHand.length === 2) {
        dealCards(players[currentPlayer]);
        dealCards(players[currentPlayer], true);
    }
    else {
        dealCards(players[currentPlayer]);
    }
    players[currentPlayer].Points = calculateHandValue(currentPlayerHand);

    // If the player hits exactly 21, they win instantly
    if (players[currentPlayer].Points === 21) {
        alert(`${players[currentPlayer].Name} hits 21!`);
        
        // Delay for 750 ms before moving to the next player
        setTimeout(() => {
            currentPlayer++;
            if (currentPlayer >= players.length) {
                dealerTurn();
            } else {
                renderGame();
            }
        }, 750);

        return;
    }
    if (players[currentPlayer].Points > 21) {
        document.querySelector('#result').textContent = `${players[currentPlayer].Name} busts!`;
        currentPlayer++;
    }
    if (currentPlayer >= players.length) {
        dealerTurn();
    } else {
        renderGame();
    }
});


document.getElementById('stand').addEventListener('click', () => {
    currentPlayer++;
    if (currentPlayer >= players.length) {
        dealerTurn();
    } else {
        renderGame();
    }
});

document.getElementById('split').addEventListener('click', () => {
    let player = players[currentPlayer];
    if (player.Hand.length === 2 && player.Hand[0].Weight === 10 && player.Hand[0].Weight === player.Hand[1].Weight) {
        player.SplitHand.push(player.Hand.pop());
        dealCards(player);
        dealCards(player, true);
        player.Points = calculateHandValue(player.Hand);
        renderGame();
    } else {
        alert("You can only split if you have two cards of the same weight and the weight is 10.");
    }
});

document.getElementById('restart').addEventListener('click', () => {
    location.reload();
});

//#endregion

//#region extra
function toggleButtons() {
    const startBtn = document.getElementById('start');
    const restartBtn = document.getElementById('restart');
    const hitBtn = document.getElementById('hit');
    const standBtn = document.getElementById('stand');
    const splitBtn = document.getElementById('split');
    if (gameRunning) {
        startBtn.style.display = 'none';
        restartBtn.style.display = 'none';
        hitBtn.style.display = 'inline';
        standBtn.style.display = 'inline';
        splitBtn.style.display = 'inline';
    } else {
        startBtn.style.display = 'inline';
        restartBtn.style.display = 'inline';
        hitBtn.style.display = 'none';
        standBtn.style.display = 'none';
        splitBtn.style.display = 'none';
    }
}

//#endregion