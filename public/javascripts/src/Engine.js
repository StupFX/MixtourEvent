'use strict';

var Engine = function () {

// private attributes and methods
    var player, currentPlayer, board, selected, nbSelected, score, nbTokens, previousMovement;

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
        previousMovement = {from : "", to : "", value : 0};
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
            removeThePile(position);
        }
    };

    var getTopOfArray = function (position) {
        var pos = getIJFromStr(position);
        var arraySize = getNumberTokenAtIJ(pos.i, pos.j);
        return board[pos.i][pos.j][arraySize-1];
    };

    var removeThePile = function (position) {
        var pos = getIJFromStr(position), i;
        var arraySize = getNumberTokenAtIJ(pos.i, pos.j);
        for(i = 0 ; i < arraySize ; i++) {
            if(board[pos.i][pos.j][i] === player.player1) {
                nbTokens.player1++;
            }
            else {
                nbTokens.player2++;
            }
            board[pos.i][pos.j][i] = 0;
        }
    };

    var putATokenInAnEmptyRoom = function (position) {
        var pos = getIJFromStr(position);
        if(isEmpty(position)) {
            board[pos.i][pos.j][0] = currentPlayer;
            if(currentPlayer === player.player1) {
                nbTokens.player1--;
            }
            else {
                nbTokens.player2--;
            }
            previousMovement = {from : "", to : "", value : 0};
            return true;
        }
        return false;
    };

    var moveAPileOnAnother = function (position) {
        var pos = getIJFromStr(position), selectedPos = getIJFromStr(selected), i;
        var selectedArraySize = getNumberTokenAtIJ(selectedPos.i, selectedPos.j);
        var authorized = authorizedMove(position);
        if(authorized) {
            for (i = selectedArraySize - nbSelected; i < selectedArraySize; i++) {
                board[pos.i][pos.j][getNumberTokenAtIJ(pos.i, pos.j)] = board[selectedPos.i][selectedPos.j][i];
                board[selectedPos.i][selectedPos.j][i] = 0;
            }
            previousMovement = {from : selected, to : position, value : nbSelected};
        }
        return authorized;
    };

    var authorizedMove = function (position) {
        var lineMove = horizontalMove(position) || verticalMove(position) || diagonalMove(position);
        var notReversedMove = notAnUndoMovement(position);
        var notEmptyTarget = !isEmpty(position);
        var rightDistance = sizeIsDistance(position);
        return lineMove && notReversedMove && notEmptyTarget && rightDistance;
    };

    var isEmpty = function (position) {
        var pos = getIJFromStr(position);
        return (getNumberTokenAtIJ(pos.i, pos.j) === 0);
    };

    var horizontalMove = function (position) {
        var pos = getIJFromStr(position), selectedPos = getIJFromStr(selected);
        var min, max, somethingBetween = 0, j;
        if(pos.i === selectedPos.i) {
            if (pos.j < selectedPos.j) {
                min = pos.j, max = selectedPos.j;
            }
            else {
                min = selectedPos.j, max = pos.j;
            }
            for (j = (min + 1); j < max; j++) {
                somethingBetween += getNumberTokenAtIJ(pos.i, j);
            }
            return (somethingBetween === 0);
        }
        return false;
    };

    var verticalMove = function (position) {
        var pos = getIJFromStr(position), selectedPos = getIJFromStr(selected);
        var min, max, somethingBetween = 0, i;
        if(pos.j === selectedPos.j) {
            if (pos.i < selectedPos.i) {
                min = pos.i, max = selectedPos.i;
            }
            else {
                min = selectedPos.i, max = pos.i;
            }
            for (i = (min + 1); i < max; i++) {
                somethingBetween += getNumberTokenAtIJ(i, pos.j);
            }
            return (somethingBetween === 0);
        }
        return false;
    };

    var diagonalMove = function (position) {
        var pos = getIJFromStr(position), selectedPos = getIJFromStr(selected);
        var x = pos.i - selectedPos.i, y = pos.j - selectedPos.j, i, j, mini, minj, maxi, maxj;
        var somethingBetween = 0;
        if(pos.i < selectedPos.i) {
            mini = pos.i, maxi = selectedPos.i;
        }
        else {
            mini = selectedPos.i, maxi = pos.i;
        }
        if(Math.abs(x) === Math.abs(y)) {
            if(pos.i < selectedPos.i) {
                minj = pos.j, maxj = selectedPos.j;
            }
            else {
                minj = selectedPos.j, maxj = pos.j;
            }
            for(i = (mini+1) ; i < maxi ; i++) {
                for(j = (minj+1) ; j < maxj ; j++) {
                    somethingBetween += getNumberTokenAtIJ(i, j);
                }
            }
            return somethingBetween === 0;
        }
        else if(Math.abs(x) === -(Math.abs(y))) {
            if(pos.i < selectedPos.i) {
                minj = pos.j, maxj = selectedPos.j;
            }
            else {
                minj = selectedPos.j, maxj = pos.j;
            }
            for(i = (mini+1) ; i < maxi ; i++) {
                for(j = (minj-1) ; j > maxj ; j--) {
                    somethingBetween += getNumberTokenAtIJ(i, j);
                }
            }
            return somethingBetween === 0;
        }
        return false;
    };

    var notAnUndoMovement = function (position) {
        return !(position === previousMovement.from
               && selected === previousMovement.to
               && nbSelected === previousMovement.value);
    };

    var sizeIsDistance = function (position) {
        var pos = getIJFromStr(position), selectedPos = getIJFromStr(selected);
        var size = getNumberTokenAtIJ(pos.i, pos.j), length;
        if(pos.i === selectedPos.i) {
            length = Math.abs(pos.j - selectedPos.j);
        }
        else {
            length = Math.abs(pos.i - selectedPos.i);
        }
        return size === length;
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

    this.selectToken = function (position, number) {
        selected = position;
        nbSelected = number;
    };

    this.deselectToken = function () {
        selected = "";
        nbSelected = 0;
    };

    this.play = function (position) {
        var authorized = false;
        if(selected !== "") {
            authorized = moveAPileOnAnother(position);
            this.deselectToken();
        }
        else {
            authorized = putATokenInAnEmptyRoom(position);
        }
        if(authorized === true) {
            drawBoard();
            attributePoint(position);
            switchPlayer();
        }
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

    initialization();
};