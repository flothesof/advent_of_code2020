import { readFileSync } from "fs";

const lines = readFileSync("input/input17.txt", "utf-8").trim().split("\n");

function make3dGrid(lines): [Map<string, number>, number, number] {
  var grid = new Map();
  for (var r = 0; r < lines.length; r++) {
    for (var c = 0; c < lines[r].length; c++) {
      if (lines[r][c] == "#") {
        grid.set([r, c, 0].toString(), 1);
      }
    }
  }
  return [grid, r, c];
}

function getNeighbors3D(x, y, z) {
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
console.log(getNeighbors(0, 0, 0));

function getNeighbors3D_opti(x, y, z) {
  return [
    [x - 1, y - 1, z - 1],
    [x - 1, y - 1, z],
    [x - 1, y - 1, z + 1],
    [x - 1, y, z - 1],
    [x - 1, y, z],
    [x - 1, y, z + 1],
    [x - 1, y + 1, z - 1],
    [x - 1, y + 1, z],
    [x - 1, y + 1, z + 1],
    [x, y - 1, z - 1],
    [x, y - 1, z],
    [x, y - 1, z + 1],
    [x, y, z - 1],
    [x, y, z + 1],
    [x, y + 1, z - 1],
    [x, y + 1, z],
    [x, y + 1, z + 1],
    [x + 1, y - 1, z - 1],
    [x + 1, y - 1, z],
    [x + 1, y - 1, z + 1],
    [x + 1, y, z - 1],
    [x + 1, y, z],
    [x + 1, y, z + 1],
    [x + 1, y + 1, z - 1],
    [x + 1, y + 1, z],
    [x + 1, y + 1, z + 1],
  ];
}

function countNeighbors3D(x, y, z, grid) {
  var count = 0;
  for (let n of getNeighbors3D_opti(x, y, z)) {
    if (grid.has(n.toString())) {
      count += 1;
    }
  }
  return count;
}

function step3D(
  grid: Map<string, number>,
  minmax,
  gridSize: number
): Map<string, number> {
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
        var n = countNeighbors3D(x, y, z, grid);
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

// part 1

var [grid, r, c] = make3dGrid(lines);
var minmax = [
  [0, r],
  [0, c],
  [0, 0],
]; // x, y and z
for (let turn = 0; turn < 6; turn++) {
  var gridSize = turn + 1;
  var grid = step3D(grid, minmax, gridSize);
}

console.log("Part 1:", grid.size);

// part 2

function make4dGrid(lines): [Map<string, number>, number, number] {
  var grid = new Map();
  for (var r = 0; r < lines.length; r++) {
    for (var c = 0; c < lines[r].length; c++) {
      if (lines[r][c] == "#") {
        grid.set([r, c, 0, 0].toString(), 1);
      }
    }
  }
  return [grid, r, c];
}

function getNeighbors4D(x, y, z, w) {
  var neighbors = [];
  for (let dx = -1; dx < 2; dx++) {
    for (let dy = -1; dy < 2; dy++) {
      for (let dz = -1; dz < 2; dz++) {
        for (let dw = -1; dw < 2; dw++) {
          if (!(dx === 0 && dy === 0 && dz === 0 && dw === 0)) {
            neighbors.push([x + dx, y + dy, z + dz, w + dw]);
          }
        }
      }
    }
  }
  return neighbors;
}

function countNeighbors4D(x, y, z, w, grid) {
  var count = 0;
  for (let n of getNeighbors4D(x, y, z, w)) {
    if (grid.has(n.toString())) {
      count += 1;
    }
  }
  return count;
}

function step4D(
  grid: Map<string, number>,
  minmax,
  gridSize: number
): Map<string, number> {
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
        for (
          let w = -gridSize + minmax[3][0];
          w < gridSize + 1 + minmax[3][1];
          w++
        ) {
          var n = countNeighbors4D(x, y, z, w, grid);
          if (grid.get([x, y, z, w].toString()) === 1) {
            if (n === 2 || n === 3) {
              newGrid.set([x, y, z, w].toString(), 1);
            }
          } else {
            if (n === 3) {
              newGrid.set([x, y, z, w].toString(), 1);
            }
          }
        }
      }
    }
  }
  return newGrid;
}

console.assert(getNeighbors4D(0, 0, 0, 0).length === 80);
console.assert(getNeighbors4D(1, 2, 3, 4).length === 80);

var [grid, r, c] = make4dGrid(lines);
var minmax = [
  [0, r],
  [0, c],
  [0, 0],
  [0, 0],
]; // x, y, z and w
for (let turn = 0; turn < 6; turn++) {
  var gridSize = turn + 1;
  var grid = step4D(grid, minmax, gridSize);
}

console.log("Part 2:", grid.size);

// Things I've learnt
// - I can annotate returns of functions for multiple types like so (otherwise typescript throws an error)
// function make4dGrid(lines): [Map<string, number>, number, number] {
// - the hashing thing is annoying: I had some issues with Map when my input was not hashable and had to resort to .toString() to get it to work
