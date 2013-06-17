"use strict"

require(["app/local-solver", "app/native-view"], 
function(solver, controller) {
    function noDups(fn) {
        var seen = {};
        return function(item) {
            if(!seen.hasOwnProperty(item)) {
                fn(item);
                seen[item] = undefined;
            }
        };
    };
    function start() {
        function whenDone() {
            solver.stopWork();
            controller.enableResetButton();
            controller.changeAction("Solve", start);
        };
        if (controller.verifyInputGrid(function (text) {
                    return !(typeof text === 'string' && text.length === 1);
                })) {
            controller.disableResetButton();
            var theGrid = controller.getInputGrid();
            controller.clearResults();
            controller.clearStatus();
            var assignments = solver.startWork(theGrid, noDups(controller.addResult),
                 function(workerId, workersLeft) {
                    controller.markStatusAsComplete(workerId);
                    if(typeof workersLeft === 'undefined' || workersLeft.length === 0) {
                        whenDone();
                    }
                 }
            );
            Object.keys(assignments).forEach(function(workerId) {
                 controller.addStatusLine(workerId, "" + workerId + "[" + assignments[workerId].join() + "]");
            });
            controller.changeAction("Stop", whenDone);
        }
    };
    controller.init(start);
});
