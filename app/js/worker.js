"use strict"

importScripts('solver.js');

addEventListener('message', function(e) {
     var data = e.data;
     var cmd  = data.cmd;
     switch(cmd) {
         case 'start' :
              var grid = data.grid;
              var locations = [];
              for(var i = 0; i < data.letters.length ; i++) {
                  var foundLoc = false;
                  for(var yLoc = 0; yLoc < grid.length && !foundLoc; yLoc++) {
                      for(var xLoc = 0; xLoc < grid[yLoc].length && !foundLoc; xLoc++) {
                          if(grid[yLoc][xLoc] === data.letters[i]) {
                              locations.push({x:xLoc, y:yLoc});
                              foundLoc = true;
                          }
                      }
                  }
              }
              Solver.start(grid, locations, data.wordList, function(result) {
                  postMessage({cmd:"result", word:result});
              });
              postMessage({cmd:"closing"});
              close();
              break;
     };

});
