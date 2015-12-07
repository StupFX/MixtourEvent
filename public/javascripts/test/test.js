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