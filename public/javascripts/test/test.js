'use strict';

var EngineTest = TestCase("TestUnitaire");

EngineTest.prototype.testInitialization = function () {
    var e = new Engine();
    assertTrue(e.getCurrentPlayer() === 1);
};