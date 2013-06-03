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

         function getWord(positions) {
             return positions.map(function(position) { 
                 return grid[position.y][position.x];
             }).join("");
         }
         function toStr(position) {
             return "x:" + position.x + "y:" + position.y;
         }

         function toTry(position, seen) {
             var canGoWest = position.x - 1 > 0;
             var canGoNorth = position.y - 1 > 0;
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
         var current = start;
         var positions = [current];
         var currentName = toStr(current);
         var seen = {currentName:undefined};
         var nextToTry = toTry(current, seen)
         while(running && nextToTry.length !== 0) {
             var next = nextToTry.shift();
             positions.push(next);
             var word = toWord(positions);
             if(wordList.hasOwnProperty(word)) {
                 resultCallback(word);
             }
             var nextName = toStr(next);
             seen[nextName] = undefined;
             var nextNextToTry = toTry(next, seen);
             if(nextNextToTry.length === 0) {
                 positions.pop();
                 delete seen[nextName];
             }
             else {
                 nextToTry.unshift.apply(nextToTry, nextNextToTry);
             }
         }
     };

     return {
          start : function(grid, start, resultFn) {
               running = true;
               doSolve(grid, start);
          },
          stop : function() {
               running = false;
          }

     };
}();


addEventListener('message', function(e) {
     var data = e.data;
     var cmd  = data.cmd;
     switch(data) {
         case 'stop' :
              Worker.stop();
              break;
         case 'start' :
              var grid = data.grid;
              var location = undefined;
              for(var yLoc = 0; yLoc < grid.length && location === undefined; yLoc++) {
                  for(var xLoc = 0; xLoc < grid[y].length && location === undefined; xLoc++) {
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
