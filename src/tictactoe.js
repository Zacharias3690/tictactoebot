'use strict';

let gameData = require('./gameData');
let utilities = require('./utilities');

module.exports = {
    checkRows,
    checkColumns,
    checkDiagonals,
    checkFull,
    getWinner,
    checkMove,
    checkPlayer,
    drawBoard,
    startGame,
    startLoop
};

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

function checkMove(game, playerOneTurn, play) {
    if((playerOneTurn && game.playerOne !== play.user) || (!playerOneTurn && game.playerTwo !== play.user)) {
        return false;
    } else if(isNaN(parseInt(play.text)) || !!game.board[parseInt(play.text) - 1]) {
        return false;
    }

    return true;
}

function drawBoard(convo, board) {
    let ui = gameData.board;
    for(let i in board) {
        if(board[i]) {
            ui = utilities.replaceAt(ui, gameData.locations[i], board[i]);
        }
    }

    convo.say(ui);
}

function startGame(convo, playerOne, playerTwo) {
    let game = {
        playerOne: playerOne,
        playerTwo: playerTwo,
        board: new Array(9)
    };

    //controller.storage.channels.save({id: message.channel, game: game});
    drawBoard(convo, game.board);
    startLoop(convo, game, true);
}

function checkPlayer(playerOneTurn, game, response) {
    if(playerOneTurn) {
        return game.playerOne === response.user;
    } else {
        return game.playerTwo === response.user;
    }
}

function startLoop(convo, game, playerOneTurn) {
    convo.ask(`Make a move player ${playerOneTurn ? 'one' : 'two'}`, (response) => {
        if(response.text === 'quit' && (response.user === game.playerOne || response.user === game.playerTwo)) {
            convo.next();
            return;
        }

        if(!checkPlayer(playerOneTurn, game, response)) {
            convo.silentRepeat();
            convo.next();
            return;
        }

        let play = response.text;

        if(checkMove(game, playerOneTurn, response)) {
            game.board[parseInt(play) - 1] = playerOneTurn ? 'X' : 'O';
            drawBoard(convo, game.board);
            playerOneTurn = !playerOneTurn;

            let winner;
            if(getWinner(game.board) !== false) {
                winner = getWinner(game.board);

                switch(winner) {
                    case gameData.playerOne:
                    case gameData.playerTwo:
                        convo.say(`player ${winner} wins!`);
                        break;
                    default:
                        convo.say('Tie game!');
                }
                convo.next();

            } else {
                startLoop(convo, game, playerOneTurn);
                convo.next();
            }
        } else {
            convo.say('Invalid move, try again');
            convo.repeat();
            convo.next();
        }
    });
}