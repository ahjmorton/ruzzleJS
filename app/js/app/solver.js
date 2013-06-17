"use strict"

var Solver = function() {
     function doSolve(grid, starts, wordList, markov, resultCallback) {
         var maxX = grid[0].length;
         var maxY = grid.length;

         function toChar(position) {
             return grid[position.y][position.x];
         }
         function toWord(positions) {
             return positions.map(toChar).join("");
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
             var current = toChar(position);
             result = result.filter(function(element, index, array) {
                 var nextChar = toChar(element);
                 return !seen.hasOwnProperty(toStr(element)) &&
                        typeof markov[current][nextChar] !== 'undefined';
             });
             result.sort(function(left, right) {
                 left = toChar(left);
                 right = toChar(right);
                 var leftProb = markov[current][left];
                 var rightProb = markov[current][right];
                 if(leftProb > rightProb) {
                     return 1;
                 }
                 else if(leftProb < rightProb) {
                     return -1;
                 }
                 else {
                     return 0;
                 }
             });
             return result;
         }
         function empty(ob) {
             for(var i in ob) { return false; }
             return true;
         }
         for(var i = 0; i < starts.length; i++) {
             var current = starts[i];
             var positions = [current];
             var currentName = toStr(current);
             var seen = {};
             seen[currentName] = undefined;
             var tryStack = {};
             tryStack[currentName] = toTry(current, seen);
             while(!empty(tryStack)) {
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
                     seen[currentName] = undefined;
                     tryStack[currentName] = toTry(current, seen);
                 }
                 var word = toWord(positions);
                 if(wordList.hasOwnProperty(word)) {
                     resultCallback(word);
                 }
             }
         }
     };

     return {
          start : function(grid, start, wordList, markov, resultFn) {
               doSolve(grid, start, wordList, markov, resultFn);
          }
     };
}();

