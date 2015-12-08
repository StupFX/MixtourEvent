'use strict';

var Engine = function () {

// private attributes and methods
    var player, currentPlayer, board, selected, nbSelected;

    var foreach3D = function (n1, n2, n3, callback) {
        var i, j, k;
        for (i = 0; i < n1; i++) {
            for (j = 0; j < n2; j++) {
                for (k = 0; k < n3; k++) {
                    callback(i, j, k);
                }
            }
        }
    };

    var foreach2D = function (n1, n2, callback) {
        var i, j;
        for (i = 0; i < n1; i++) {
            for (j = 0; j < n2; j++) {
                callback(i, j);
            }
        }
    };

    var getNumberTokenAtIJ = function (i, j) {
        var cpt = 0, k;
        for (k = 0 ; k < 8 ; k++) {
            if(board[i][j][k] !== 0) {
                cpt++;
            }
        }
        return cpt;
    };

    var drawBoard = function () {
        var str = "\n";
        foreach2D(5, 5, function (i, j) {
            str += getNumberTokenAtIJ(i, j) + " ";
            if (j === 4) {
                str += "\n";
            }
        });
        console.log(str);
    };

    var initializationBoard = function () {
        var i;
        board = [];
        for (i = 0; i < 5; i++) {
            board[i] = new Array (5);
        }
        foreach2D(5, 5, function (i, j) {
            board[i][j] = new Array (8);
        });
        foreach3D(5, 5, 8, function (i, j, k) {
            board[i][j][k] = 0;
        });
    };

    var initialization = function () {
        player = {player1 : 1, player2 : 2};
        currentPlayer = player.player1;
        selected = "";
        nbSelected = 0;
        initializationBoard();
    };

    var getIJFromStr = function (str) {
        var column = str.charCodeAt(0) - 65;
        var line = str.charCodeAt(1) - 49;

        return {"i" : line, "j" : column};
    };

// public methods
    this.getCurrentPlayer = function () {
        return currentPlayer;
    };

    this.getCaseBoard = function (i, j, k) {
        return board[i][j][k];
    };

    this.selectToken = function (position, number) {
        selected = position;
        nbSelected = number;
    };

    this.unselectToken = function () {
        selected = "";
        nbSelected = 0;
    };

    this.play = function (position) {
        var pos = getIJFromStr(position), i;
        if(selected !== "") {
            var selectedPos = getIJFromStr(selected), tmp;
            var maxSelectedPos = getNumberTokenAtIJ(selectedPos.i, selectedPos.j);
            for(i = maxSelectedPos - nbSelected ; i < maxSelectedPos ; i++) {
                board[pos.i][pos.j][getNumberTokenAtIJ(pos.i, pos.j)] = board[selectedPos.i][selectedPos.j][i];
                board[selectedPos.i][selectedPos.j][i] = 0;
            }
        }
        else {
            board[pos.i][pos.j][0] = currentPlayer;
        }
        drawBoard();
    };

    initialization();
};