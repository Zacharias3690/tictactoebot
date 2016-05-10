'use strict';

let readLine = require('readline');
let Botkit = require('botkit');
let gameData = require('./gameData');
let utilities = require('./utilities');
let controller = Botkit.slackbot();
let input = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

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
        });
    };

    bot.startConversation(message, (response, convo) => {
        askPlayerOne(response, convo);

        convo.on('end', (convo) => {
           if(convo.status == 'completed') {
               startGame(bot, playerOne, playerTwo);
           }
        });
    });
});

function checkRows(player) {
    if( (player[0] && player[1] && player[2]) ||
        (player[3] && player[4] && player[5]) ||
        (player[6] && player[7] && player[8])) {
        return true;
    }

    return false;
}

function checkColumns(player) {
    if( (player[0] && player[3] && player[6]) ||
        (player[1] && player[4] && player[7]) ||
        (player[2] && player[5] && player[8])) {
        return true;
    }

    return false;
}

function checkDiagonals(player) {
    if( (player[0] && player[4] && player[8]) ||
        (player[2] && player[4] && player[6])) {
        return true;
    }

    return false;
}

function checkFull(board) {
    let boardFull = true;

    for(let i = 0; i < board.length; i++) {
        if(!board[i]) {
            boardFull = false;
            break;
        }
    }

    return boardFull;
}

function getWinner(board) {

    let p1 = new Array(9);
    let p2 = new Array(9);

    for(let i = 0; i < board.length; i++) {
        if(board[i]) {
            if(board[i] === 'X') p1[i] = true;
            if(board[i] === 'O') p2[i] = true;
        }
    }

    if(checkRows(p1) || checkColumns(p1) || checkDiagonals(p1)) return gameData.playerOne;
    if(checkRows(p2) || checkColumns(p2) || checkDiagonals(p2)) return gameData.playerTwo;
    if(checkFull(board)) return gameData.tie;

    return false;
}

function checkMove(board, player, play) {
    return !board[parseInt(play) - 1];
}

function drawBoard(board) {
    let ui = gameData.board;
    for(let i in board) {
        if(board[i]) {
            ui = utilities.replaceAt(ui, gameData.locations[i], board[i]);
        }
    }

    return ui;
}

function startGame(bot, playerOne, playerTwo) {
    let game = {
        playerOne: playerOne,
        playerTwo: playerTwo,
        board: new Array(9)
    };

    controller.storage.channels.save({id: message.channel, game: game});

    bot.startConversation(drawBoard(game.board), (response, convo) => {

        startLoop(convo, game.board, true);
    });
}

function startLoop(convo, board, playerOneTurn) {
    convo.ask(`Make a move player ${playerOneTurn ? 'one' : 'two'}\n`, (play) => {
        if(checkMove(board, playerOneTurn, play)) {
            board[parseInt(play) - 1] = playerOneTurn ? 'X' : 'O';
            convo.say(drawBoard(board));
            playerOneTurn = !playerOneTurn;
        } else {
            console.log('Invalid move, try again');
        }

        let winner;
        if(getWinner(board) !== false) {
            winner = getWinner(board);

            switch(winner) {
                case gameData.playerOne:
                case gameData.playerTwo:
                    console.log(`player ${winner} wins!`);
                    break;
                default:
                    console.log('Tie game!');
            }
            convo.next();

        } else {
            startLoop(board, playerOneTurn);
        }
    });
}