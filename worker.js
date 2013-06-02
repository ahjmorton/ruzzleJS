"use strict"



var Worker = function() {
     var wordList = 
     {

     };
     var running = false;

     function doSolve(grid, start) {
         var maxX = grid[0].length;
         var maxY = grid.length;

         function getWord(positions) {
             var word = "";
             for(var i; i < positions.length; i++) {
                 letterLoc = positions[i];
                 word.concat(grid[letterLoc.y][letterLoc.x]);
             }
             return word;
         }

         function toTry(position, seen) {
             var canGoWest = position.x - 1 > 0;
             var canGoNorth = position.y - 1 > 0;
             var canGoEast = position.x + 1 < maxX;
             var canGoSouth = position.y + 1 < maxY;
             var result = [];
             if(canGoWest) {
                 
             }
         }
         var seen = {};
         while(running) {
             
         }
     };

     return {
          start : function(grid, start
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
              Worker.start(grid, location);
              break;
     };

});
