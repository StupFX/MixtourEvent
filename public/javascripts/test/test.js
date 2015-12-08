'use strict';

var EngineTest = TestCase("TestUnitaire");

EngineTest.prototype.testInitialization = function () {
    var e = new Engine();
    assertTrue(e.getCurrentPlayer() === 1);
};

EngineTest.prototype.testBasicPlay = function () {
    var e = new Engine();
    e.play("A1");
    assertTrue(e.getCaseBoard(0,0,0) === 1);
    e.selectToken("A1", 1);
    e.play("A2");
    assertTrue(e.getCaseBoard(1,0,0) === 1);
};

EngineTest.prototype.testPlayer = function () {
    var e = new Engine();
    e.play("A1");
    assertTrue(e.getCaseBoard(0,0,0) === 1);
    e.play("A2");
    assertTrue(e.getCaseBoard(1,0,0) === 2);
};

EngineTest.prototype.testScore = function () {
    var e = new Engine();
    e.play("A1");
    e.play("A2");
    e.selectToken("A1", 1);
    e.play("A2");
    e.play("A3");
    e.selectToken("A2", 2);
    e.play("A3");
    e.play("A4");
    e.selectToken("A3", 3);
    e.play("A4");
    e.play("A3");
    e.selectToken("A4", 4);
    e.play("A3");
    assertTrue(e.getScorePerPlayer(1) === 1);
    assertFalse(e.doesTheCurrentPlayerWin());
    assertTrue(e.getNbTokensOfPlayer(2) === 25);
};

EngineTest.prototype.testMoves = function () {
    var e = new Engine();
    e.play("A1");
    assertFalse(e.play("A1"));
    e.play("B2");
    e.selectToken("A1", 1);
    assertTrue(e.play("B2"));
    e.play("C4");
    e.selectToken("B2", 1);
    assertFalse(e.play("C4"));
    e.play("C3");
    e.selectToken("C4", 1);
    e.play("C3");
    e.selectToken("B2", 1);
    e.play("C3");
    e.selectToken("C3", 1);
    assertFalse(e.play("B2"));
};