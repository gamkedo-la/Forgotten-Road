const PATHFINDING_DEBUG_LOG = false; // set to true for verbose debug info in the console

// this lets us reuse previously created grid data
// so set this to TRUE if the world changes (new buildings)
// to force a fresh data gathering step
const PATHFINDING_REUSES_GRID_UNLESS_REFRESHED = false; // true, use the variable below, not sure we can make each unit a recalculated grid.
var pathfindingGridDataNeedsRefreshing = false; // set to true calculate grid
const USE_FASTER_ARRAYREMOVE = false; // set to true for faster but maybe buggy version

var unvisitedList = [];
const TILE_GOAL = 3; //Temp used for end tile

function SetupPathfindingGridData(whichPathfinder) {
  let endR = -1;
  let endC = -1;

  unvisitedList = []; 
  let pathfinder = whichPathfinder || {}; // Ensure pathfinder is valid

  // Create a new pathfinding grid (1D array)
  let pathfindingGrid = new Array(TILE_COLS * TILE_ROWS).fill(null);
  
  // Initialize collision grid if not already created
  collisionGrid = Array.from({ length: TILE_COLS }, () =>
    Array.from({ length: TILE_ROWS }, () => new GridElement())
  );

  // Populate collision grid and pathfinding grid
  for (let row = 0; row < TILE_COLS; row++) {
    for (let col = 0; col < TILE_ROWS; col++) {
        let idx = col * TILE_ROWS + row;

      //if (!collisionGrid[row][col]) {
          collisionGrid[col][row] = new GridElement();
          let backgroundGridTileType = backgroundGrid[col][row];
          collisionGrid[col][row].setup(col, row, idx, backgroundGridTileType, pathfinder);
      //}

      if (!collisionGrid[col][row].elementType) {
        console.warn("ElementType is undefined at:", col, row);
      } else {
        //console.log(collisionGrid[row][col].elementType);
        //console.log(col, row, idx, backgroundGrid[row][col])
      }

      // Assign grid element  properties
      //collisionGrid[row][col].name = `${col},${row}`;
      //collisionGrid[row][col].idx = idx;
      //collisionGrid[row][col].pathfinder = pathfinder;
      unvisitedList.push(collisionGrid[col][row]);
  
      // Store reference in pathfindingGrid
      pathfindingGrid[idx] = collisionGrid[col][row];

      // Check if this is the goal tile
      if (collisionGrid[col][row].elementType === TILE_GOAL) { 
          endR = row;
          endC = col;
      }
      turnPathFindingDrawingOn = true;
    }
  }

  // Compute heuristic values if a goal exists
  if (endR !== -1 && endC !== -1) {
      for (let col = 0; col < TILE_COLS; col++) {
          for (let row = 0; row < TILE_ROWS; row++) {
              let idxHere = tileCoordToIndex(col, row);
              collisionGrid[col][row].hVal = hValCal(col, row, endC, endR, 3, true);
          }
      }
  }

  pathfindingGridDataNeedsRefreshing = false;

  return pathfindingGrid;
}


function hValCal(atColumn,atRow, toColumn,toRow, multWeight, geometric) { /////
  var diffC = atColumn - toColumn;
  var diffR = atRow - toRow;
  var geo = geometric;

  if(geo){
	return multWeight * Math.sqrt( diffC*diffC + diffR*diffR ); // geometric dist.
  } else {
    return multWeight * (Math.abs(diffC) + Math.abs(diffR)); ///// manhatten streets
  }
}

function startPath(toTile, pathFor){
    var currentTile = pixCoordToIndexIn1D(pathFor.x, pathFor.y);

    if (PATHFINDING_DEBUG_LOG) console.log("starting pathfinding from tile "+currentTile+" to tile "+toTile);
    if (PATHFINDING_DEBUG_LOG) console.log("- collisionGrid["+currentTile+"]="+collisionGrid[currentTile]+" and collisionGrid["+toTile+"]="+collisionGrid[toTile]);
    if (PATHFINDING_DEBUG_LOG) console.time("- pathfinding took"); // start a debug timer

    if (toTile< 0 || toTile >= pathfinderGrid.length) { // invalid or off board
        if (PATHFINDING_DEBUG_LOG) console.log("Not a valid location");
		return;
    }
	
	  if (pathfindingGridDataNeedsRefreshing || !PATHFINDING_REUSES_GRID_UNLESS_REFRESHED) { 
       pathFinderGrid = SetupPathfindingGridData(pathFor);
       console.log("updating pathFinderGrid");
    }
	  
    pathfinderGrid[toTile].setGoal();
	  PathfindingNextStep(pathFor);
 
    // on my computer this is usually 0.003 ms
    if (PATHFINDING_DEBUG_LOG) console.timeEnd("- pathfinding took"); // end the debug timer and say how long it look
    if (!pathFor.tilePath || !pathFor.tilePath.length) {
        if (PATHFINDING_DEBUG_LOG) console.log("- pathfinding failed: zero-length path created!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    } else { 
        if (PATHFINDING_DEBUG_LOG) console.log("- pathfinding succeeded! path length in tiles: "+pathFor.tilePath.length);
    }


}

function PathfindingNextStep(whichPathfinder) {
  var totalCalculations = 0;
  var tentativeDistance = 0;
	var pathfinder = whichPathfinder;
	var safetyBreak = 50000;
	var endTile = null;

      while(unvisitedList.length > 0 && safetyBreak-- > 0) { //// "while Q is not empty:"
        //// "u := vertex in Q with min dist[u]"
        var currentTile = null;
        var currentTileIndex = -1;
        var ctDistWithH; ///// a* with hVal heuristic added
        //if (PATHFINDING_DEBUG_LOG) console.log(unvisitedList.length);
        for (var i=0; i < unvisitedList.length; i++) {
          totalCalculations++;
          var compareTile = unvisitedList[i];
        
          if(currentTile == null || compareTile.distance + compareTile.hVal < ctDistWithH) { /////
            currentTile = compareTile;
            currentTileIndex = i;
            ctDistWithH = currentTile.distance + currentTile.hVal; /////
            //if (PATHFINDING_DEBUG_LOG) console.log(`Current Tile: ${currentTile.name}, Distance: ${currentTile.distance}, Heuristic: ${currentTile.hVal}`);
          }
        }
        
        // we can optimize out this slow search n destroy loop
        if (USE_FASTER_ARRAYREMOVE) {
            // we already know which one to remove so we don't need to look for it
            unvisitedList.splice(currentTileIndex,1); 
        } else {
            // do it the slow way
            arrayRemove(unvisitedList,currentTile); //// remove u from Q
        }
     
        //// "for each neighbor v of u: //// where v has not yet been removed from Q"
        var neighborsStillInUnvisitedList = currentTile.myUnvisitedNeighbors();
        for (var i = 0; i < neighborsStillInUnvisitedList.length; i++) {
          totalCalculations++;
          var neighborTile = neighborsStillInUnvisitedList[i];
          
          ///// A* note: hVal is NOT part of these calls, would accumulate
          if (neighborTile.isTileType(NOTHING)) {
            tentativeDistance = currentTile.distance+1;
            neighborTile.setDistIfLess(tentativeDistance, currentTile);
            neighborTile.setTile(VISITED);
          } else if (neighborTile.isTileType(DEST)) {
            tentativeDistance = currentTile.distance+1;
            neighborTile.setDistIfLess (tentativeDistance, currentTile);
            endTile=neighborTile;
            unvisitedList = []; //// empty the unvisitedList since we've found the end
          }
        }
      
      } 
      
       { //// all nodes have been accounted for, work backward from end's tiles for path
             //// terminate the algorithm from taking further steps since we found what we needed
        if (endTile!=null) {
          //if (PATHFINDING_DEBUG_LOG) console.log("Best distance found: " + endTile.distance);
			if(endTile.distance == INFINITY_START_DISTANCE){
				if (PATHFINDING_DEBUG_LOG) console.log("No Valid Path Found");
			} else {
			  // walk backward from destination to create the path
			  var previousTile = endTile.cameFrom;
			  pathfinder.tilePath = [];
			  
			  pathfinder.tilePath.unshift(endTile.idx);
              var countSteps = 0;
			  for (var pathIndex = endTile.distance; pathIndex>1; pathIndex--) {
                totalCalculations++;
                countSteps++;
			//	if (PATHFINDING_DEBUG_LOG) console.log(previousTile.name);
				pathfinder.tilePath.unshift(previousTile.idx);
				previousTile.setTile(PATH);  
				previousTile = previousTile.cameFrom;  
			  }
			}
		}
  }

  if (PATHFINDING_DEBUG_LOG) console.log("- pathfinding completed after doing "+totalCalculations+" calculations.");

}

function arrayContains(arr, obj) {
    var arrLen = arr.length;
    for (var i = 0; i < arrLen; i++) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}
function arrayRemove(arr, obj) {
    for (var i = arr.length-1; i >= 0; i--) {
        if (arr[i] === obj) {
            arr.splice(i,1);
            return;
        }
    }
}

