'use strict';

var EngineTest = TestCase("TestUnitaire");

EngineTest.prototype.testInitialization = function () {
    var e = new Engine();
    assertTrue(e.getCurrentPlayer() === 1);
};

EngineTest.prototype.testBasicPlay = function () {
    var e = new Engine();
    e.play(0, 0);
    assertTrue(e.getCaseBoard(0,0,0) === 1);
    e.play(1, 0);
    e.selectToken(0, 0, 1);
    e.play(1, 0);
    assertTrue(e.getCaseBoard(1,0,0) === 2);
};

EngineTest.prototype.testPlayer = function () {
    var e = new Engine();
    e.play(0, 0);
    assertTrue(e.getCaseBoard(0,0,0) === 1);
    e.play(1, 0);
    assertTrue(e.getCaseBoard(1,0,0) === 2);
};

EngineTest.prototype.testScore = function () {
    var e = new Engine();
    e.play(0, 0);
    e.play(1, 0);
    e.selectToken(0, 0, 1);
    e.play(1, 0);
    e.play(2, 0);
    e.selectToken(1, 0, 2);
    e.play(2, 0);
    e.play(3, 0);
    e.selectToken(2, 0, 3);
    e.play(3, 0);
    e.play(2, 0);
    e.selectToken(3, 0, 4);
    e.play(2, 0);
    assertTrue(e.getScorePerPlayer(1) === 1);
    assertFalse(e.doesTheCurrentPlayerWin());
    assertTrue(e.getNbTokensOfPlayer(2) === 25);
};

EngineTest.prototype.testMoves = function () {
    var e = new Engine();
    e.play(0, 0);
    assertFalse(e.play(0, 0));
    e.play(1, 1);
    e.selectToken(0, 0, 1);
    assertTrue(e.play(1, 1));
    e.play(3, 2);
    e.selectToken(1, 1, 1);
    assertFalse(e.play(3, 2));
    e.play(2, 2);
    e.selectToken(3, 2, 1);
    e.play(2, 2);
    e.selectToken(1, 1, 1);
    e.play(2, 2);
    e.selectToken(2, 2, 1);
    assertFalse(e.play(1, 1));
};

EngineTest.prototype.testNothingBetween = function () {
    var e = new Engine();
    e.play(0, 0);
    e.play(1, 1);
    e.play(2, 2);
    e.play(3, 3);
    e.selectToken(3, 3, 1);
    assertFalse(e.play(4, 4));
    e.selectToken(3, 3, 1);
    e.play(2, 2);
    e.selectToken(0, 0, 1);
    assertFalse(e.play(2, 2));
};

EngineTest.prototype.testDistance = function () {
    var e = new Engine();
    e.play(0, 0);
    e.play(2, 2);
    e.play(3, 3);
    e.selectToken(2, 2, 1);
    e.play(3, 3);
    e.selectToken(0, 0, 1);
    assertFalse(e.play(3, 3));
    e.play(1, 1);
    e.selectToken(1, 1, 1);
    assertTrue(e.play(3, 3));
};