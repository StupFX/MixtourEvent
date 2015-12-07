'use strict';

var Engine = function () {

// private attributes and methods
    var player, currentPlayer;
    var initialization = function () {
        player = {player1 : 0, player2 : 1};
        currentPlayer = player.player1;
    };


// public methods
    this.getCurrentPlayer = function () {
        return currentPlayer;
    };
    initialization();
};