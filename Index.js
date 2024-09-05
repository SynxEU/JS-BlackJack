var suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
var values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
var deck;
var players;
var currentPlayers = 0;

function createDeck()
{
    deck = new Array();
    for (var i = 0; i < values.length; i++)
    {
        for (var x = 0; x < suits.length; x++)
        {
            //Finds the weight of the cards based on the value
            var weight = parseInt(values[i]);
            if (values[i] == "J" || values[i] == "Q" || values[i] == "K")
                weight = 10;
            if (values[i] == "A")
                weight = 11;

            //Card object to push into the deck array
            var card = { Value: values[i], Suit: suits[x], Weight: weight };
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
        var hand = new Array();
        var player = { Name: 'Player ' + i, ID: i, Points: 0, Hand: hand }
        players.push(player)
    }
}