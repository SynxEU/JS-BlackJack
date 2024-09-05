# BlackJack (or 21) Project

~ By Synx

## Table of content
* [Tags](#Tags)
* [Change Log](#Changelog)
* [Known Issues](#Issues)

## Intro
This is a school project. \
It's main purpose is to yea play blackjack, this project is getting made with JavaScript with HTML and CSS for website. \
When you press start, it's gonna start the game IF you have entered the amount of players playing (When websockets are added its done automaticly). \
You can then hit to get another card, but stand if you don't wanna get more cards. \
You can split so you now have 2 hands (double or nothing). \
You will bust (lose) if you have over 21 or one of the other players (including dealer) has a number closer to 21 or hits 21. \
If you're the closes to 21 or hits 21 you will win (aslong as it isn't over 21).

## Information & tech

|    Language    | projectVersion | 
| -------------- | -------------- |
|   JavaScript   |     v0.0.5     |
| -------------- | -------------- |

## Tags
* [v0.0.5](https://github.com/SynxEU/JS-BlackJack/releases/tag/v0.0.5)

## Changelog
[Github](https://github.com/SynxEU/JS-BlackJack/commits/main/)

## Known Issues
No pretty webdesign. \
Buggy multiplayer. \
No card pictures.


## V0.0.0 til V1.0.0:

#### v0.0.5
* Added almost all functions
  *  createDeck
  *  shuffleCards
  *  createPlayers
  *  dealCards
  *  calculateHandValue
  *  updateDeckCount
  *  renderGame
  *  startGame
  *  determinWinner
  *  dealerTurn
* Document.getElement for
  * Hit
  * Stand
  * Start game
  * Add players
  * Updateable deck count
* Made some HTML (Not pretty or really functional)
* Made some CSS (Not pretty or really functional)

# To-do

* Website & Design
* WebSocket (For multiplayer)
* Animations (if possible)
* Add card pictures
* Split
