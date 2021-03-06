'use strict';

describe('app', () => {
    let app = require('./tictactoe');

    describe('checkRows()', () => {
        it('Checks if first row has a win conditions', () => {
            let player = [true,true,true,
                false,false,false,
                false,false,false];
            expect(app.checkRows(player)).toBe(true);
        });

        it('Checks if second row has a win condition', () => {
            let player = [false,false,false,
                true,true,true,
                false, false, false];
            expect(app.checkRows(player)).toBe(true);
        });

        it('Checks if third row has a win condition', () => {
            let player = [false,false,false,
                false,false,false,
                true,true,true];
            expect(app.checkRows(player)).toBe(true);
        });

        it('Returns false for invalid win conditions', () => {
            let player = [false,true,false,
                false,true,false,
                true,false,false];
            expect(app.checkRows(player)).toBe(false);
        });
    });

    describe('checkColumns()', () => {
        it('Checks if first column has a win conditions', () => {
            let player = [true,false,false,
                true,false,false,
                true,false,false];
            expect(app.checkColumns(player)).toBe(true);
        });

        it('Checks if second column has a win condition', () => {
            let player = [false,true,false,
                false,true,false,
                false,true,false];
            expect(app.checkColumns(player)).toBe(true);
        });

        it('Checks if third column has a win condition', () => {
            let player = [false,false,true,
                false,false,true,
                false,false,true];
            expect(app.checkColumns(player)).toBe(true);
        });

        it('Returns false for invalid win conditions', () => {
            let player = [false,true,false,
                false,true,false,
                true,false,false];
            expect(app.checkColumns(player)).toBe(false);
        });
    });

    describe('checkDiagonals()', () => {
        it('Checks if first column has a win conditions', () => {
            let player = [true,false,false,
                false,true,false,
                false,false,true];
            expect(app.checkDiagonals(player)).toBe(true);
        });

        it('Checks if second column has a win condition', () => {
            let player = [false,false,true,
                false,true,false,
                true,false,false];
            expect(app.checkDiagonals(player)).toBe(true);
        });

        it('Returns false for invalid win conditions', () => {
            let player = [false,true,false,
                false,true,false,
                true,false,false];
            expect(app.checkDiagonals(player)).toBe(false);
        });
    });

    describe('checkFull()', () => {
        it('returns true for a full board', () => {
            let board = ['X','O','X',
                'X','O','X',
                'X','O','X'];
            expect(app.checkFull(board)).toBe(true);
        });

        it('return false for a non full board', () => {
            let board = ['X','O','X',
                'X','O','',
                'X','O','X'];
            expect(app.checkFull(board)).toBe(false);
        });
    });

    describe('getWinner()', () => {
        it('responds with a 1 for player one win', () => {
            let board = ['X','X','X',
                'O','X','O',
                'X','O','X'];
            expect(app.getWinner(board)).toEqual(1);
        });

        it('responds with a 2 for player two win', () => {
            let board = ['O','O','O',
                'O','X','O',
                'X','O','X'];
            expect(app.getWinner(board)).toEqual(2);
        });

        it('responds with a 3 for tie', () => {
            let board = ['O','X','O',
                'O','X','O',
                'X','O','X'];

            expect(app.getWinner(board)).toEqual(3);
        });

        it('responds false for incomplete game', () => {
            let board = ['X','X','O',
                'O','','',
                'X','O','X'];
            expect(app.getWinner(board)).toEqual(false);
        });
    });

    describe('checkMove()', () => {
        let game, play;

        beforeEach(() => {
            game = {
                board: ['X','','',
                    '','','',
                    '','',''],
                playerOne: '12345678'
            };

            play = {
                text: null,
                user: '12345678'
            };
        });

        it('returns false for non numbers', () => {
            play.text = 'a';
            expect(app.checkMove(game, true, play)).toBe(false);
        });

        it('returns false for spots already filled in', () => {
            play.text = '1';
            expect(app.checkMove(game, true, play)).toBe(false);
        });

        it('returns false for wrong user', () => {
            play.text = '2';
            play.user = 'asdfjkl';
            expect(app.checkMove(game, true, play)).toBe(false);
        });

        it('returns true for valid moves', () => {
            play.text = '2';
            expect(app.checkMove(game, true, play)).toBe(true);
        });
    });

    describe('checkPlayer()', () => {
        let game;

        beforeEach(() => {
            game = {
                playerOne: '1',
                playerTwo: '2'
            };

        });

        it('returns true if player one responds on their turn', () => {
            let message = { user: game.playerOne };
            expect(app.checkPlayer(true, game, message)).toBe(true);
        });

        it('returns true if player two responds on their turn', () => {
            let message = { user: game.playerTwo };
            expect(app.checkPlayer(false, game, message)).toBe(true);
        });

        it('returns false if not player one on their turn', () => {
            let message = {user: game.playerTwo};
            expect(app.checkPlayer(true, game, message)).toBe(false);
        });

        it('responds false if not player two on their turn', () => {
            let message = { user: game.playerOne };
            expect(app.checkPlayer(false, game, message)).toBe(false);
        });
    });

    describe('drawBoard()', () => {

    });
});