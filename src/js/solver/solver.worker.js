"use strict";

require(["./solver.js"], function(Solver) {
  addEventListener("message", function(e) {
    var data = e.data;
    var cmd = data.cmd;
    switch (cmd) {
      case "start":
        var grid = data.grid;
        var locations = data.letters.map(function(element) {
          return { x: element[0], y: element[1] };
        });
        Solver.start(grid, locations, data.wordList, data.markov, function(
          result
        ) {
          postMessage({ cmd: "result", word: result });
        });
        postMessage({ cmd: "closing" });
        close();
        break;
    }
  });
});
