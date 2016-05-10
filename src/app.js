'use strict';

let readLine = require('readline');
let Botkit = require('botkit');
let utilities = require('./utilities');
let ticTacToe = require('./tictactoe');
let controller = Botkit.slackbot();

let SLACK_TOKEN = process.env.SLACK_TOKEN;
if(!SLACK_TOKEN) {
    let config = require('./keys');
    SLACK_TOKEN = config.token;
    console.log('Using local key');
}

//startGame();

controller.spawn({
    token: SLACK_TOKEN
}).startRTM();

controller.hears('play', ['direct_message'], (bot, message) => {
    let playerOne, playerTwo;

    let askPlayerOne = function(response, convo) {
        convo.ask('Who\'s player one?', (response, convo) => {
            playerOne = response.user;
            askPlayerTwo(response, convo);
            convo.next();
        });
    };

    let askPlayerTwo = function(response, convo) {
        convo.ask('Who\'s player two?', (response, convo) => {
            playerTwo = response.user;
            convo.next();
            ticTacToe.startGame(convo, playerOne, playerTwo)
        });
    };

    bot.startConversation(message, (response, convo) => {
        askPlayerOne(response, convo);
    });
});

