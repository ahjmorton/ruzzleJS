var Solver = function() {
     function doSolve(grid, starts, wordList, resultCallback) {
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
          start : function(grid, start, wordList, resultFn) {
               doSolve(grid, start, wordList, resultFn);
          }
     };
}();

