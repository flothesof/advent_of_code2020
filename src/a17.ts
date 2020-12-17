import { readFileSync } from "fs";

const lines = readFileSync("input/input17_test.txt", "utf-8")
  .trim()
  .split("\n");

var grid = new Map();

for (var r = 0; r < lines.length; r++) {
  for (var c = 0; c < lines[r].length; c++) {
    if (lines[r][c] == "#") {
      grid.set([r, c, 0].toString(), 1);
    }
  }
}

function getNeighbors(x, y, z) {
  var neighbors = [];
  for (let xx = -1; xx < x + 2; xx++) {
    for (let yy = -1; yy < y + 2; yy++) {
      for (let zz = -1; zz < z + 2; zz++) {
        if (!(xx === x && yy === y && zz === z)) {
          neighbors.push([xx, yy, zz]);
        }
      }
    }
  }
  return neighbors;
}

function countNeighbors(x, y, z, grid) {
  var count = 0;
  for (let n of getNeighbors(x, y, z)) {
    if (grid.has(n.toString())) {
      count += 1;
    }
  }
  return count;
}

function step(grid: Map<string, number>, minmax, gridSize: number) {
  var newGrid = new Map();
  for (let x = -gridSize + minmax[0][0]; x < gridSize + 1 + minmax[0][1]; x++) {
    for (
      let y = -gridSize + minmax[1][0];
      y < gridSize + 1 + minmax[1][1];
      y++
    ) {
      for (
        let z = -gridSize + minmax[2][0];
        z < gridSize + 1 + minmax[2][1];
        z++
      ) {
        var n = countNeighbors(x, y, z, grid);
        if (grid.get([x, y, z].toString()) === 1) {
          if (n === 2 || n === 3) {
            newGrid.set([x, y, z].toString(), 1);
          }
        } else {
          if (n === 3) {
            newGrid.set([x, y, z].toString(), 1);
          }
        }
      }
    }
  }
  return newGrid;
}

console.log(grid);
console.log(grid.has([0, 1, 0].toString()));
var minmax = [
  [0, r],
  [0, c],
  [0, 0],
]; // x, y and z
for (let turn = 0; turn < 6; turn++) {
  var gridSize = turn + 1;
  var grid = step(grid, minmax, gridSize);
}

console.log(grid);
