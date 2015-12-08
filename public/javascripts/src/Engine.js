'use strict';

var Engine = function () {

// private attributes and methods
    var player, currentPlayer, board, selected, nbSelected, score, nbTokens;

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
        score = {player1 : 0, player2 : 0};
        nbTokens = {player1 : 25, player2 : 25};
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

    var switchPlayer = function () {
        if(currentPlayer === player.player1) {
            currentPlayer = player.player2;
        }
        else {
            currentPlayer = player.player1;
        }
    };

    var attributePoint = function (position) {
        var pos = getIJFromStr(position);
        var arraySize = getNumberTokenAtIJ(pos.i, pos.j);
        if(arraySize >= 5) {
            if(getTopOfArray(position) === 1) {
                score.player1++;
            }
            else {
                score.player2++;
            }
        }
    };

    var getTopOfArray = function (position) {
        var pos = getIJFromStr(position);
        var arraySize = getNumberTokenAtIJ(pos.i, pos.j);
        return board[pos.i][pos.j][arraySize-1];
    };

// public methods
    this.getCurrentPlayer = function () {
        return currentPlayer;
    };

    this.getCaseBoard = function (i, j, k) {
        return board[i][j][k];
    };

    this.getNbTokensOfPlayer = function (idPlayer) {
        if(idPlayer === player.player1) {
            return nbTokens.player1;
        }
        else {
            return nbTokens.player2;
        }
    };

    this.selectToken = function (position, number) {
        selected = position;
        nbSelected = number;
    };

    this.deselectToken = function () {
        selected = "";
        nbSelected = 0;
    };

    this.play = function (position) {
        var pos = getIJFromStr(position), i;
        if(selected !== "") {
            var selectedPos = getIJFromStr(selected);
            var maxSelectedPos = getNumberTokenAtIJ(selectedPos.i, selectedPos.j);
            for(i = maxSelectedPos - nbSelected ; i < maxSelectedPos ; i++) {
                board[pos.i][pos.j][getNumberTokenAtIJ(pos.i, pos.j)] = board[selectedPos.i][selectedPos.j][i];
                board[selectedPos.i][selectedPos.j][i] = 0;
            }
            this.deselectToken();
        }
        else {
            board[pos.i][pos.j][0] = currentPlayer;
            if(currentPlayer === player.player1) {
                nbTokens.player1--;
            }
            else {
                nbTokens.player2--;
            }
        }
        switchPlayer();
        drawBoard();
        attributePoint(position);
    };

    this.getScorePerPlayer = function (idPlayer) {
        if(idPlayer === player.player1) {
            return score.player1;
        }
        else {
            return score.player2;
        }
    };

    this.doesTheCurrentPlayerWin = function () {
        if(currentPlayer === player.player1) {
            if(score.player1 === 5) {
                return true;
            }
        }
        if(currentPlayer === player.player2) {
            if(score.player2 === 5) {
                return true;
            }
        }
        return false;
    };

    initialization();
};