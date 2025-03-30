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
function findPath(startX, startY, endX, endY, collisionGrid) {
  let openSet = [];
  let closedSet = [];
  let startNode = new GridElement(startX, startY, true);
  let endNode = new GridElement(endX, endY, true);
  openSet.push(startNode);

  while (openSet.length > 0) {
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
      }
  }
  
  //console.log("Path not found from "+startX+","+startY+" to "+endX+","+endY);
  // no such function:
  // let path = AStarAlgorithm(startX, startY, endX, endY, collisionGrid); // A* function
  // return path || []; // Ensure it returns an array
  return [];
}



// Get neighboring tiles
function getNeighbors(node, collisionGrid) {
    let neighbors = [];
    let directions = [
        { dx: -1, dy: 0 }, // Left (W)
        { dx: 1, dy: 0 },  // Right (E)
        { dx: 0, dy: -1 }, // Up (N)
        { dx: 0, dy: 1 }   // Down (S)
    ];
    
    for (let dir of directions) {
        let nx = node.x + dir.dx;
        let ny = node.y + dir.dy;

        // Ensure we're within grid bounds
        if (nx >= 0 && ny >= 0 && nx < TILE_COLS && ny < TILE_ROWS) {
            neighbors.push(new GridElement(nx, ny, collisionGrid[ny][nx].isWalkable));
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
