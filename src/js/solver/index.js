"use strict";

define(["./solver.worker.js"], function(Worker) {
  var GRID_WIDTH = 4;
  var LETTERS_PER_WORKER = 4;
  var stoppers = {};
  function sublists(array, size) {
    return array.reduce(function(previousValue, nextValue, index) {
      if (index % size === 0) {
        previousValue.push([nextValue]);
      } else {
        previousValue[previousValue.length - 1].push(nextValue);
      }
      return previousValue;
    }, []);
  }
  function createAssignments(grid, letterCount) {
    return sublists(
      grid.map(function(element, index, array) {
        return [index % GRID_WIDTH, Math.floor(index / GRID_WIDTH)];
      }),
      letterCount
    );
  }
  return {
    startWork: function(grid, wordlist, resultFunc, stopFunc) {
      var wordListObj = wordlist.wordlist;
      var markovObj = wordlist.markov;
      resultFunc = resultFunc || function() {};
      stopFunc = stopFunc || function() {};
      var gridToSendToWorkers = sublists(grid, GRID_WIDTH);
      var assignments = createAssignments(grid, LETTERS_PER_WORKER);
      var letterAssignments = sublists(grid, LETTERS_PER_WORKER);
      var results = {};
      stoppers = {};
      for (var i = 0; i < assignments.length; i++) {
        var worker = new Worker();
        var cleanup = (function(workerId) {
          return function() {
            delete stoppers[workerId];
            stopFunc(workerId, Object.keys(stoppers));
          };
        })(i);
        worker.addEventListener(
          "message",
          (function(cleanupFunc, workerId) {
            return function(msgData) {
              msgData = msgData.data;
              switch (msgData.cmd) {
                case "result":
                  resultFunc(msgData.word);
                  break;
                case "closing":
                  cleanupFunc();
                  break;
              }
            };
          })(cleanup, i)
        );
        stoppers[i] = (function(toClose, cleanupFunc) {
          return function() {
            toClose.terminate();
            cleanupFunc();
          };
        })(worker, cleanup);
        results[i] = letterAssignments[i];
        worker.postMessage({
          cmd: "start",
          grid: gridToSendToWorkers,
          wordList: wordListObj,
          markov: markovObj,
          letters: assignments[i]
        });
      }
      return results;
    },
    stopWork: function() {
      for (var prop in stoppers) {
        stoppers[prop]();
      }
    }
  };
});
