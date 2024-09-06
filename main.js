const suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
const weights = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
var deck;
var players;
var dealerHand = new Array();
let playerCount;
let currentPlayer = 0

function createDeck()
{
    deck = new Array();
    for (var i = 0; i < values.length; i++)
    {
        for (var x = 0; x < suits.length; x++)
        {
            //Card object to push into the deck array
            var card = { Value: values[i], Suit: suits[x], Weight: weights[i] };
            console.log(weights[i]);
            deck.push(card);
        }
    }
}

function shuffleCards()
{
    for (var i = deck.length - 1; i > 0; i--) {
        // Generate a random index from 0 to i
        var j = Math.floor(Math.random() * (i + 1));
        
        // Swap card locations
        var tmp = deck[i];
        deck[i] = deck[j];
        deck[j] = tmp;
    }
}

function createPlayers(amount) 
{
    players = new Array();
    for (var i = 1; i <= amount; i++)
    {
        var player = { Name: 'Player ' + i, ID: i, Points: 0, Hand: new Array() }
        players.push(player)
    }
}

function dealCards(player)
{
    var card = deck.pop();
    player.Hand.push(card)
    return card;
}

function calculateHandValue(hand) {
    var value = 0;
    var aceCount = 0;
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

function updateDeckCount() {
    document.getElementById('deck-number').textContent = deck.length;
}

function renderGame() {
    // Gets the div of the dealers hand and cards
    const dealerDiv = document.querySelector('#dealer-hand .cards');
    dealerDiv.innerHTML = '';

    // Show the first dealer card as a face-down card
    const cardBackImg = document.createElement('img');
    cardBackImg.src = `Card_Pictures/Card_Back.png`;
    cardBackImg.classList.add('cardBackGround');
    dealerDiv.appendChild(cardBackImg);

    // Show the rest of the dealer's cards as normal
    dealerHand.slice(1).forEach(card => {
        const img = document.createElement('img');
        img.src = `Card_Pictures/${card.Value}_of_${card.Suit}.png`;
        dealerDiv.appendChild(img);
    });

    // Gets the div of the players hand(s) and cards
    const playerDiv = document.querySelector('#player-hands .cards')
    playerDiv.innerHTML = '';

    players.forEach((player) => {
        const handDiv = document.createElement('div');
        handDiv.innerHTML = `<h3>${player.Name}: ${player.Points} points</h3>`;
        player.Hand.forEach(card => {
            const img = document.createElement('img');
            img.src = `Card_Pictures/${card.Value}_of_${card.Suit}.png`;
            handDiv.appendChild(img);
        });
        playerDiv.appendChild(handDiv);
    });

    updateDeckCount();
    document.querySelector('#result').textContent = '';
}

document.getElementById('add-players').addEventListener('click', () => {
    playerCount = parseInt(document.getElementById('player-count').value);
    if (isNaN(playerCount) || playerCount <= 0) {
        alert("Please enter a valid number of players.");
        return;
    }
    else {
        alert(`You have added ${playerCount} player`)
    }
});

function startGame(amount) {
    createDeck();
    shuffleCards();
    createPlayers(amount);
    
    // Deal two cards to the dealer
    dealerHand = [dealCards({ Hand: [] }), dealCards({ Hand: [] })];

    // Deal two cards to each player and "calculates" hand value
    players.forEach(player => {
        dealCards(player);
        dealCards(player);
        player.Points = calculateHandValue(player.Hand);
    });
    renderGame();
}

function determinWinner()
{
    let dealerValue = calculateHandValue(dealerHand);
    const results = new Array();

    players.forEach(player => {
        let playerValue = calculateHandValue(player.Hand);
        let result = `${player.Name} has ${playerValue}.`

        if (playerValue > 21) {
            result += `${player.Name} busts and loses.`;
        } else if (playerValue === 21 || playerValue > dealerValue && playerValue <= 21  ) {
            result += `${player.Name} wins!`;
        } else if (playerValue === dealerValue) {
            result += `It's a tie for ${player.Name}.`;
        } else {
            result += `${player.Name} loses.`;
        }

        results.push(result);
    })
}

document.getElementById('start').addEventListener('click', () => {
    if (!playerCount || playerCount <= 0) {
        alert("Please enter the number of players first.");
        return;
    }
    startGame(playerCount);
});

document.getElementById('hit').addEventListener('click', () => {
    dealCards(players[currentPlayer]);

    players[currentPlayer].Points = calculateHandValue(players[currentPlayer].Hand);

    if (players[currentPlayer].points > 21) {
        document.querySelector('#result').textContent = `${players[currentPlayer].Name} busts!`;
        currentPlayer++;
    }

    if (currentPlayer > players.length) {
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


function dealerTurn() {
    // Draws till he hits 17
    while (calculateHandValue(dealerHand) < 17) {
        dealCards({ Hand: dealerHand });
    }

    determinWinner();
    
    renderGame();
}