import view from "./view";
import solver from "../solver";
import loadWordlist from "../wordlists";

function noDups(fn) {
  var seen = {};
  return function(item) {
    if (!seen.hasOwnProperty(item)) {
      fn(item);
      seen[item] = undefined;
    }
  };
}

function whenDone() {
  solver.stopWork();
  view.enableResetButton();
  view.changeAction("Solve", start);
}

function start() {
  if (
    view.verifyInputGrid(function(text) {
      return !(typeof text === "string" && text.length === 1);
    })
  ) {
    view.disableResetButton();
    var theGrid = view.getInputGrid();
    view.clearResults();
    view.clearStatus();
    loadWordlist().then(wordlist => {
      var assignments = solver.startWork(
        theGrid,
        wordlist,
        noDups(view.addResult),
        function(workerId, workersLeft) {
          view.markStatusAsComplete(workerId);
          if (typeof workersLeft === "undefined" || workersLeft.length === 0) {
            whenDone();
          }
        }
      );
      Object.keys(assignments).forEach(workerId => {
        view.addStatusLine(
          workerId,
          "" + workerId + "[" + assignments[workerId].join() + "]"
        );
      });
      view.changeAction("Stop", whenDone);
    });
  }
}

export default function() {
  view.init(start);
}
