var presetUnwalkableTiles = [];
var playerUnits = [];

function GridElement() {
  this.elementType = NOTHING; // Default to a known type

  this.tilC;
  this.tilR; // so each tile knows its own col and row position in overall grid
  this.tilIdx;

  this.hVal; ///// heuristic weight (some kind of distance) for A*

  this.elementType;
  this.distance;
  this.cameFrom; // GridElement reference to which tile we left to reach this one

  this.setup = function(myC, myR, myIdx, myElement, whichPathFinder) {
    this.reset();
    this.tilC = myC;
    this.tilR = myR;
    this.tilIdx = myIdx;

    //console.log(`🚀 Setting tilIdx at Setup: (${this.tilC}, ${this.tilR}) => ${this.tilIdx}`);

    this.elementType = myElement;
    this.elementType = this.isNotPassible(this.elementType);

    //console.log(`🔍 After isNotPassible: (${this.tilC}, ${this.tilR}) => ${this.tilIdx}`);

    var pathFinderX = whichPathFinder.x;
    var pathFinderY = whichPathFinder.y;
    var playersLocation = pixCoordToIndex(pathFinderX, pathFinderY);

    if (this.tilIdx == playersLocation) {
      //  console.log(`🎯 Player Spawn Found at ${this.tilIdx}, marking as SOURCE`);
        this.elementType = SOURCE;
        this.setDistIfLess(0, null);
    }
};


  this.reset = function() {
      if (this.elementType == VISITED || this.elementType == PATH) {
          this.elementType = NOTHING;
      }
      this.distance = INFINITY_START_DISTANCE;
      this.cameFrom = null;
  }

  this.display = function() {
      var pieceName = "";
      var tileBGColor = '#FF000080';

      //console.log(this.elementType)

      switch (this.elementType) {
          case NOTHING:
              tileBGColor = '#aaaaaa80'
              pieceName += "N"; //+ (this.hVal).toFixed(1); ///// showing hVal
              break;
          case SOURCE:
              pieceName += "S";
              tileBGColor = '#55ff5580'; //light green
              break;
          case DEST:
              pieceName += "D";
              tileBGColor = '#aaaaff80';
              break;
          case WALL:
              pieceName += "W";
              tileBGColor = '#55555580';
              break;
          case VISITED: ///// updated to include hVal
              pieceName += "" + this.distance //" " + this.hVal.toFixed(1);
              tileBGColor = '#bbbb0080';
              break;
          case PATH: ///// updated to include hVal
              pieceName += "" + this.distance //" " + this.hVal.toFixed(1);
              tileBGColor = '#00000080';
              break;
      }

      var tileLeftEdgeX = this.tilC * GRID_WIDTH;
      var tileTopEdgeY = this.tilR * GRID_HEIGHT;

      colorRect(tileLeftEdgeX, tileTopEdgeY, GRID_WIDTH, GRID_HEIGHT, tileBGColor);
      ctx.fillStyle = 'white';
      //canvasContext.fillText(pieceName, tileLeftEdgeX + GRID_WIDTH / 2, tileTopEdgeY + GRID_HEIGHT / 2);

      /*if (tileOverIdx == this.tilIdx) { // mouseover?
          outlineRect(tileLeftEdgeX, tileTopEdgeY, GRID_WIDTH, GRID_HEIGHT, 'green');
      }*/
  }

  this.setGoal = function() {
      this.elementType = DEST;
  }

  this.isNotPassible = function(elementType) {
    let updatedElementType = elementType; // ✅ Now it's properly scoped

    if (updatedElementType == TILE_GRASS ||
        updatedElementType == TILE_ROAD || 
        updatedElementType == TILE_FLOOR) {
        return NOTHING;
    }
    if (tileTypeWalkable(updatedElementType)) { 
        return NOTHING;
    }
    if (updatedElementType == presetUnwalkableTiles[0]) { 
        return WALL;
    }
    if (updatedElementType == playerUnits[0]) {
        return SOURCE;
    }
    return updatedElementType; // ✅ Return the correctly processed tile type
  };

  this.setTile = function(toType) {
      this.elementType = toType;
  }

  function GetGridAtCR(atRow, atCol) {
    if (atRow >= 0 && atRow < TILE_ROWS && atCol >= 0 && atCol < TILE_COLS) {
        return collisionGrid[atRow][atCol]; // ✅ Now consistent
    }
    return null;
  }

  this.myUnvisitedNeighbors = function() {
      var myNeighbors = [];
      var consideredNeighbor;

      if (this.tilC > 0) {
          consideredNeighbor = GetGridAtCR(this.tilC - 1, this.tilR);
          if (arrayContains(unvisitedList, consideredNeighbor)) {
              myNeighbors.push(consideredNeighbor);
          }
      }
      if (this.tilC < TILE_COLS - 1) {
          consideredNeighbor = GetGridAtCR(this.tilC + 1, this.tilR);
          if (arrayContains(unvisitedList, consideredNeighbor)) {
              myNeighbors.push(consideredNeighbor);
          }
      }
      if (this.tilR > 0) {
          consideredNeighbor = GetGridAtCR(this.tilC, this.tilR - 1);
          if (arrayContains(unvisitedList, consideredNeighbor)) {
              myNeighbors.push(consideredNeighbor);
          }
      }
      if (this.tilR < TILE_ROWS - 1) {
          consideredNeighbor = GetGridAtCR(this.tilC, this.tilR + 1);
          if (arrayContains(unvisitedList, consideredNeighbor)) {
              myNeighbors.push(consideredNeighbor);
          }
      }

      return myNeighbors;
  }

  this.isTileType = function(matchType) {
      return (this.elementType == matchType);
  }

  // function to update distance, do so only if less than previously found best distance
  this.setDistIfLess = function(newDistToConsider, comingFrom) {
      //console.log("comparing " + newDistToConsider + " vs " + this.distance);
      if (newDistToConsider < this.distance) {
          this.distance = newDistToConsider;
          this.cameFrom = comingFrom;
      }
  }
} //end class declaration

function tileTypeWalkable(tileType) {
  return tileType === NOTHING || tileType === SOURCE || tileType === PATH;
}
