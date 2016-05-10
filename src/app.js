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
let SLACK_TOKEN;

process.argv.forEach((val, index, array) => {
   console.log(index + ': ' + val);

    let args = val.split('=');
    if(args[0] === 'SLACK_TOKEN') {
        let SLACK_TOKEN = args[1];
    }
});

if(!SLACK_TOKEN) {
    let config = require('./config');
    SLACK_TOKEN = config.token;
}

startGame();

controller.spawn({
    token: SLACK_TOKEN
}).startRTM();

controller.hears('hello', ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
    bot.reply(message, 'goodbye');
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

    console.log(ui);
}

function startGame() {
    let board = new Array(9);
    drawBoard(board);
    startLoop(board, true);
}

function startLoop(board, playerOneTurn) {
    input.question(`Make a move player ${playerOneTurn ? 'one' : 'two'}\n`, (play) => {
        if(checkMove(board, playerOneTurn, play)) {
            board[parseInt(play) - 1] = playerOneTurn ? 'X' : 'O';
            drawBoard(board);
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
            input.close();

        } else {
            startLoop(board, playerOneTurn);
        }
    });
}