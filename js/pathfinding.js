// if openset is larger than this, assume pathfinding
// is stuck in an infinite loop and exit
const PATHFINDING_TOO_MANY_NODES = 10000;

// max pixels between points to ignore the click
// this caused perfectly valid clicks to be ignored
const MAX_PATH_DISTANCE = 999999; // 480; 




// GridElement Class for Pathfinding
class GridElement {
  constructor(x, y, walkable) {
      this.x = x;
      this.y = y;
      this.walkable = walkable;
      this.g = 0;
      this.h = 0;
      this.f = 0;
      this.parent = null;
  }
}

// A* Pathfinding Algorithm
function findPath(startX, startY, endX, endY, collisionGrid, caller="unknown", maxDistance=MAX_PATH_DISTANCE) {
  // console.log("starting pathfinding from "+startX+","+startY+" to "+endX+","+endY);
  let openSet = [];
  let closedSet = [];
  let startNode = new GridElement(startX, startY, true);
  let endNode = new GridElement(endX, endY, true);

  if (!startNode) { console.error("PATHFINDING ERROR: no start node!"); return []; }
  if (!endNode) { console.error("PATHFINDING ERROR: no end node!"); return []; }
  if (!collisionGrid) { console.error("PATHFINDING ERROR: no collisionGrid!"); return []; }

   const distance = heuristic(startNode, endNode);
   if (distance > maxDistance) {
      console.log("IGNORING MOVE: Pathfinding distance " + distance + " exceeds maximum " + maxDistance + ", from " + caller);
      // FIXME: pick a new target location
      // that goes only as far as allowed
      // (you should always move if you click a valid location)
      return [];
   }

  openSet.push(startNode);

  while (openSet.length > 0) {
      if (openSet.length>PATHFINDING_TOO_MANY_NODES) { // sanity check to avoid infinite hangs
          console.log("ERROR: pathfinding infinite loop! Giving up.");
          return [];
      }
      let lowestIndex = 0;
      for (let i = 1; i < openSet.length; i++) {
          if (openSet[i].f < openSet[lowestIndex].f) {
              lowestIndex = i;
          }
      }
      
      let currentNode = openSet[lowestIndex];
      
      if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
          let path = [];
          let temp = currentNode;
          while (temp.parent) {
              path.push(temp);
              temp = temp.parent;
          }
   //       console.log("finished pathfinding! path found ok.");
          return path.reverse();
      }
      
      openSet.splice(lowestIndex, 1);
      closedSet.push(currentNode);
      
      let neighbors = getNeighbors(currentNode, collisionGrid);
      for (let neighbor of neighbors) {
          if (closedSet.includes(neighbor) || !neighbor.walkable) {
              continue;
          }
          let tempG = currentNode.g + 1;
          let newPath = false;
          
          if (!openSet.includes(neighbor)) {
              openSet.push(neighbor);
              newPath = true;
          } else if (tempG < neighbor.g) {
              newPath = true;
          }
          
          if (newPath) {
              neighbor.g = tempG;
              neighbor.h = heuristic(neighbor, endNode);
              neighbor.f = neighbor.g + neighbor.h;
              neighbor.parent = currentNode;
          }
      } // loop neighbors
  } // repeat until openset is empty
  
  //console.log("Path not found from "+startX+","+startY+" to "+endX+","+endY);
  // no such function:
  // let path = AStarAlgorithm(startX, startY, endX, endY, collisionGrid); // A* function
  // return path || []; // Ensure it returns an array
  console.log("finished pathfinding! path NOT found.");
  return [];
}



// Get neighboring tiles
function getNeighbors(node, collisionGrid) {
    let neighbors = [];
    let directions = [
      { dx: -1, dy: 0 }, // Left
      { dx: 1, dy: 0 },  // Right
      { dx: 0, dy: -1 }, // Up
      { dx: 0, dy: 1 }   // Down
    ];
  
    for (let dir of directions) {
      let nx = node.x + dir.dx;
      let ny = node.y + dir.dy;
  
      if (nx >= 0 && ny >= 0 && nx < TILE_COLS && ny < TILE_ROWS) {
        const isWalkable = collisionGrid[ny][nx].isWalkable &&
                           !isTileOccupiedByPushBlock(nx, ny);
        neighbors.push(new GridElement(nx, ny, isWalkable));
      }
    }
    return neighbors;
  }
  


// Heuristic Function (Manhattan Distance)
function heuristic(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// Move Player Along Path
function movePlayerAlongPath(player, path) {
  if (path.length > 0) {
      let nextTile = path.shift();
      player.x = nextTile.x * TILE_W;
      player.y = nextTile.y * TILE_H;
  }
}
function isWalkable(row, col) {
    return (
        collisionGrid[row] &&
        collisionGrid[row][col] !== TILE_WALL
    );
}
