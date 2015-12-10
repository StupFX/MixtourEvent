'use strict';

var Engine = function () {

// private attributes and methods
    var player, currentPlayer, board, selected, nbSelected, score, nbTokens, previousMovement, lastAction;

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
        previousMovement = {from : {i : "", j : ""}, to : {i : "", j : ""}, value : 0};
        lastAction ="";
        currentPlayer = player.player1;
        selected = {i : "", j : ""};
        nbSelected = 0;
        initializationBoard();
    };

    var switchPlayer = function () {
        if(currentPlayer === player.player1) {
            currentPlayer = player.player2;
        }
        else {
            currentPlayer = player.player1;
        }
    };

    var attributePoint = function (x, y) {
        var arraySize = getNumberTokenAtIJ(x, y);
        if(arraySize >= 5) {
            if(getTopOfArray(x, y) === 1) {
                score.player1++;
            }
            else {
                score.player2++;
            }
            removeThePile(x, y);
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

    var getNbTokensOfCurrentPlayer = function () {
        if(currentPlayer === player.player1) {
            return nbTokens.player1;
        }
        else {
            return nbTokens.player2;
        }
    };

    var getTopOfArray = function (x, y) {
        var arraySize = getNumberTokenAtIJ(x, y);
        return board[x][y][arraySize-1];
    };

    var removeThePile = function (x, y) {
        var i;
        var arraySize = getNumberTokenAtIJ(x, y);
        for(i = 0 ; i < arraySize ; i++) {
            if(board[x][y][i] === player.player1) {
                nbTokens.player1++;
            }
            else {
                nbTokens.player2++;
            }
            board[x][y][i] = 0;
        }
    };

    var putATokenInAnEmptyRoom = function (x, y) {
        if(isEmpty(x, y) && getNbTokensOfCurrentPlayer() > 0) {
            board[x][y][0] = currentPlayer;
            if(currentPlayer === player.player1) {
                nbTokens.player1--;
            }
            else {
                nbTokens.player2--;
            }
            previousMovement = {from : {i : "", j : ""}, to : {i : "", j : ""}, value : 0};
            return true;
        }
        return false;
    };

    var moveAPileOnAnother = function (x, y) {
        var i;
        var selectedArraySize = getNumberTokenAtIJ(selected.i, selected.j);
        var authorized = authorizedMove(x, y);
        if(authorized) {
            for (i = selectedArraySize - nbSelected; i < selectedArraySize; i++) {
                board[x][y][getNumberTokenAtIJ(x, y)] = board[selected.i][selected.j][i];
                board[selected.i][selected.j][i] = 0;
            }
            previousMovement = {from : {i : selected.i, j : selected.j}, to : {i : x, j : y}, value : nbSelected};
        }
        return authorized;
    };

    var authorizedMove = function (x, y) {
        var lineMove = horizontalMove(x, y) || verticalMove(x, y) || diagonalMove(x, y);
        var notReversedMove = notAnUndoMovement(x, y);
        var notEmptyTarget = !isEmpty(x, y);
        var rightDistance = sizeIsDistance(x, y);
        return lineMove && notReversedMove && notEmptyTarget && rightDistance;
    };

    var isEmpty = function (x, y) {
        return (getNumberTokenAtIJ(x, y) === 0);
    };

    var horizontalMove = function (x, y) {
        var min, max, somethingBetween = 0, j;
        if(x === selected.i) {
            if (y < selected.j) {
                min = y, max = selected.j;
            }
            else {
                min = selected.j, max = y;
            }
            for (j = (min + 1); j < max; j++) {
                somethingBetween += getNumberTokenAtIJ(x, j);
            }
            return (somethingBetween === 0);
        }
        return false;
    };

    var verticalMove = function (x, y) {
        var min, max, somethingBetween = 0, i;
        if(y === selected.j) {
            if (x < selected.i) {
                min = x, max = selected.i;
            }
            else {
                min = selected.i, max = x;
            }
            for (i = (min + 1); i < max; i++) {
                somethingBetween += getNumberTokenAtIJ(i, y);
            }
            return (somethingBetween === 0);
        }
        return false;
    };

    var diagonalMove = function (x, y) {
        var _x = x - selected.i, _y = y - selected.j, i, j, mini, minj, maxi, maxj;
        var somethingBetween = 0;
        if(x < selected.i) {
            mini = x, maxi = selected.i;
            minj = y, maxj = selected.j;
        }
        else {
            mini = selected.i, maxi = x;
            minj = selected.j, maxj = y;
        }
        if(Math.abs(_x) === Math.abs(_y)) {
            for(i = (mini+1) ; i < maxi ; i++) {
                for(j = (minj+1) ; j < maxj ; j++) {
                    somethingBetween += getNumberTokenAtIJ(i, j);
                }
            }
            return somethingBetween === 0;
        }
        else if(Math.abs(_x) === -(Math.abs(_y))) {
            for(i = (mini+1) ; i < maxi ; i++) {
                for(j = (minj-1) ; j > maxj ; j--) {
                    somethingBetween += getNumberTokenAtIJ(i, j);
                }
            }
            return somethingBetween === 0;
        }
        return false;
    };

    var notAnUndoMovement = function (x, y) {
        return !(x === previousMovement.from.i
               && y === previousMovement.from.j
               && selected.i === previousMovement.to.i
               && selected.j === previousMovement.to.j
               && nbSelected === previousMovement.value);
    };

    var sizeIsDistance = function (x, y) {
        var size = getNumberTokenAtIJ(x, y), length;
        if(x === selected.i) {
            length = Math.abs(y - selected.j);
        }
        else {
            length = Math.abs(x - selected.i);
        }
        return size === length;
    };

    var fromIJToPosition = function (x, y) {
        var xx = String.fromCharCode(x + 49);
        var yy = String.fromCharCode(y + 65);
        return "" + yy + xx;
    };

    var changeLastAction = function (x, y) {
        lastAction = "Player " + currentPlayer + " ";
        if(selected.i !== "" && selected.j !== "") {
            lastAction += "From ";
            lastAction += fromIJToPosition(previousMovement.from.i, previousMovement.from.j) + " To ";
            lastAction += fromIJToPosition(previousMovement.to.i, previousMovement.to.j);
            lastAction += " : " +previousMovement.value + " Token";
        } else {
            lastAction += "Add token to " + fromIJToPosition(x, y);
        }
    };

// public methods
    this.getCurrentPlayer = function () {
        return currentPlayer;
    };

    this.getBoard = function() {
        return board;
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

    this.selectToken = function (x, y, number) {
        selected = {i : x, j : y};
        nbSelected = number;
    };

    this.deselectToken = function () {
        selected = {i : "", j : ""};
        nbSelected = 0;
    };

    this.play = function (x, y) {
        var authorized = false;
        if(selected.i !== "" && selected.j !== "") {
            authorized = moveAPileOnAnother(x, y);
            changeLastAction(x, y);
            this.deselectToken();
        }
        else {
            authorized = putATokenInAnEmptyRoom(x, y);
            changeLastAction(x, y);
        }
        if(authorized === true) {
            attributePoint(x, y);
            switchPlayer();
        }
        // drawBoard();
        return authorized;
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

    this.getLastAction = function () {
        return lastAction;
    };

    this.isThereAWinner = function () {
        var winner = 0;
        if(score.player1 === 5) {
            winner = player.player1;
        }
        else if(score.player2 === 5) {
            winner = player.player2;
        }
        return winner;
    };

    initialization();
};