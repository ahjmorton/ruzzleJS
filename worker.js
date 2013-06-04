"use strict"

var Worker = function() {
     var wordList = 
     {
         an:undefined
     };
     var running = false;

     function doSolve(grid, start, resultCallback) {
         var maxX = grid[0].length;
         var maxY = grid.length;

         function toWord(positions) {
             return positions.map(function(position) { 
                 return grid[position.y][position.x];
             }).join("");
         }
         function toStr(position) {
             return "x:" + position.x + "y:" + position.y;
         }

         function toTry(position, seen) {
             var canGoWest = position.x - 1 >= 0;
             var canGoNorth = position.y - 1 >= 0;
             var canGoEast = position.x + 1 < maxX;
             var canGoSouth = position.y + 1 < maxY;
             var result = [];
             if(canGoWest) {
                 result.unshift({x:position.x - 1, y:position.y});
             }
             if(canGoWest && canGoNorth) {
                 result.unshift({x:position.x - 1, y:position.y - 1});
             }
             if(canGoNorth) {
                 result.unshift({x:position.x, y:position.y - 1});
             }
             if(canGoNorth && canGoEast) {
                 result.unshift({x:position.x + 1, y:position.y - 1});
             }
             if(canGoEast) {
                 result.unshift({x:position.x + 1, y:position.y});
             }
             if(canGoEast && canGoSouth) {
                 result.unshift({x:position.x + 1, y:position.y + 1});
             }
             if(canGoSouth) {
                 result.unshift({x:position.x, y:position.y + 1});
             }
             if(canGoSouth && canGoWest) {
                 result.unshift({x:position.x - 1, y:position.y + 1});
             }
             return result.filter(function(element, index, array) {
                 return !seen.hasOwnProperty(toStr(element));
             });
         }
         function empty(ob) {
             for(var i in ob) { return false; }
             return true;
         }
         var current = start;
         var positions = [current];
         var currentName = toStr(current);
         var seen = {};
         seen[currentName] = 1;
         var tryStack = {};
         tryStack[currentName] = toTry(current, seen);
         while(running && !empty(tryStack)) {
             if(tryStack[currentName].length === 0) {
                 delete tryStack[currentName];
                 delete seen[currentName];
                 positions.pop();
                 if(positions.length !== 0) {
                     current = positions[positions.length - 1];
                     currentName = toStr(current);
                 }
                 continue;
             }
             else {
                 var nextToTry = tryStack[currentName].pop();
                 positions.push(nextToTry);
                 current = nextToTry;
                 currentName = toStr(current);
                 seen[currentName] = 1;
                 tryStack[currentName] = toTry(current, seen);
             }
             var word = toWord(positions);
             if(wordList.hasOwnProperty(word)) {
                 resultCallback(word);
             }
         }
     };

     return {
          start : function(grid, start, resultFn) {
               running = true;
               doSolve(grid, start, resultFn);
          },
          stop : function() {
               running = false;
          }

     };
}();


addEventListener('message', function(e) {
     var data = e.data;
     var cmd  = data.cmd;
     switch(cmd) {
         case 'stop' :
              Worker.stop();
              break;
         case 'start' :
              var grid = data.grid;
              var location = undefined;
              for(var yLoc = 0; yLoc < grid.length && location === undefined; yLoc++) {
                  for(var xLoc = 0; xLoc < grid[yLoc].length && location === undefined; xLoc++) {
                      if(grid[yLoc][xLoc] === data.letter) {
                          location = {x:xLoc, y:yLoc};
                      }
                  }
              }
              Worker.start(grid, location, function(result) {
                  postMessage(result);
              });
              break;
     };

});
