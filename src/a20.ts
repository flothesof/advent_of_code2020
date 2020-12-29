import { reverse } from "dns";
import { readFileSync } from "fs";
import { isLineBreak } from "typescript";
import { sumArray, Counter, prodArray } from "./util/util";

const tilesStrings = readFileSync("input/input20.txt", "utf-8")
  .trim()
  .split("\n\n");

function reverseString(str) {
  return str.split("").reverse().join("");
}

function hashCode(str: string) {
  return Math.max(hash(str), hash(reverseString(str)));
}

function hash(str: string) {
  var hash = 0,
    i,
    chr;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

class Tile {
  id: number;
  content: string;
  hashes: number[];
  rotation: number;
  flipH = false;
  flipV = false;
  R: number;
  C: number;

  constructor(content) {
    // parsing the content and extracting hashes
    this.content = content;
    var lines = content.trim().split("\n");
    var first = lines.shift();
    this.id = first.match(/^Tile (\d+):/)[1];
    this.R = lines.length;
    this.C = lines[0].length;

    // init hashes
    this.hashes = [];
    // top
    this.hashes.push(hashCode(lines[0]));
    // right
    this.hashes.push(hashCode(lines.map((line) => line[this.C - 1]).join("")));
    // bottom
    this.hashes.push(hashCode(lines[lines.length - 1]));
    // left
    this.hashes.push(hashCode(lines.map((line) => line[0]).join("")));

    // init rotation
    this.rotation = 0;
  }

  rotateRight(ntimes = 1) {
    for (let i = 0; i < ntimes; i++) {
      var last = this.hashes.splice(3, 1);
      this.hashes.splice(0, 0, last[0]);
      this.rotation += 1;
    }
  }

  rotateLeft(ntimes = 1) {
    for (let i = 0; i < ntimes; i++) {
      var first = this.hashes.shift();
      this.hashes.push(first);
      this.rotation -= 1;
    }
  }

  flipHorizontal() {
    this.flipH = !this.flipH;
    this.hashes = [
      this.hashes[0],
      this.hashes[3],
      this.hashes[2],
      this.hashes[1],
    ];
  }

  flipVertical() {
    this.flipV = !this.flipV;
    this.hashes = [
      this.hashes[2],
      this.hashes[1],
      this.hashes[0],
      this.hashes[3],
    ];
  }
}

var tiles = new Map();
for (let tileString of tilesStrings) {
  var tile = new Tile(tileString);
  tiles.set(tile.id, tile);
}

var hashCounts = new Counter();
for (let tile of tiles.values()) {
  hashCounts.update(tile.hashes);
}

function toHashCounts(tile: Tile, hashCounts) {
  return tile.hashes.map((hash) => hashCounts.get(hash));
}

function countUnique(tile, hashCounts) {
  return sumArray(toHashCounts(tile, hashCounts).filter((n) => n === 1));
}
var cornerTiles = [];
for (let tile of tiles.values()) {
  if (countUnique(tile, hashCounts) === 2) {
    cornerTiles.push(tile);
  }
}

var borderTiles = [];
for (let tile of tiles.values()) {
  if (countUnique(tile, hashCounts) === 1) {
    borderTiles.push(tile);
  }
}

console.log("Found", cornerTiles.length, "tiles with 2 unmatched borders.");
console.log("Found", borderTiles.length, "tiles with 1 unmatched borders.");
console.log("Part 1:", prodArray(cornerTiles.map((tile) => tile.id)));

// part 2 : damn'it, we DO have to solve the puzzle after all...

function getCandidatesToRight(currentTile, remainingTiles) {
  var rightHash = currentTile.hashes[1];
  return remainingTiles.filter((tile) => tile.hashes.indexOf(rightHash) > -1);
}

function getCandidatesToBottom(currentTile, remainingTiles) {
  var bottomHash = currentTile.hashes[2];
  return remainingTiles.filter((tile) => tile.hashes.indexOf(bottomHash) > -1);
}

function gridSize(positions) {
  var rc = [...positions.keys()][0].split(",").map(parseFloat);
  var [R, C] = [rc[0], rc[1]];
  for (let pos of positions.keys()) {
    rc = pos.split(",").map(parseFloat);
    R = Math.max(R, rc[0]);
    C = Math.max(C, rc[1]);
  }
  return [R, C];
}

function rotateGridClockwise(grid) {
  var newGrid = [];
  var n = grid.length;
  for (let c = 0; c < n; c++) {
    var line = [];
    for (let r = 0; r < n; r++) {
      line.push(grid[n - r - 1][c]);
    }
    newGrid.push(line);
  }
  return newGrid;
}

function rotateGridClockwiseNTimes(grid, ntimes: number) {
  var newGrid = copyGrid(grid);
  for (let i = 0; i < ntimes; i++) {
    newGrid = rotateGridClockwise(newGrid);
  }
  return newGrid;
}

function flipHorizontal(grid) {
  var newGrid = [];
  for (let line of grid) {
    newGrid.push(line.reverse());
  }
  return newGrid;
}

function flipVertical(grid) {
  var newGrid = [];
  var n = grid.length;
  for (let r = 0; r < n; r++) {
    var line = [];
    for (let c = 0; c < n; c++) {
      line.push(grid[n - r - 1][c]);
    }
    newGrid.push(line);
  }
  return newGrid;
}

function makeGridWithBorder(tile: Tile) {
  // remove header
  var lines = tile.content.split("\n").slice(1);
  var grid = [];
  // cut out the edges
  for (let line of lines) {
    let nums = [];
    for (let i = 0; i < line.length; i++) {
      if (line[i] === "#") {
        nums.push(1);
      } else {
        nums.push(0);
      }
    }
    grid.push(nums);
  }

  // rotate
  for (let i = 0; i < tile.rotation; i++) {
    grid = rotateGridClockwise(grid);
  }

  // apply flipH and flipV
  if (tile.flipV) {
    grid = flipVertical(grid);
  }
  if (tile.flipH) {
    grid = flipHorizontal(grid);
  }

  return grid;
}

function makeGridWithoutBorders(tile: Tile) {
  var gridWithBorder = makeGridWithBorder(tile);
  var gridWithoutBorder = [];
  for (let line of gridWithBorder.slice(1, gridWithoutBorder.length - 1)) {
    let newLine = [];
    for (let i = 1; i < line.length - 1; i++) {
      newLine.push(line[i]);
    }
    gridWithoutBorder.push(newLine);
  }
  return gridWithoutBorder;
}

function makeEmptyGrid(R, C) {
  var grid = [];
  for (let r = 0; r < R; r++) {
    var line = [];
    for (let c = 0; c < C; c++) {
      line.push(0);
    }
    grid.push(line);
  }
  return grid;
}

function insertIntoGrid(mainGrid, startR, startC, subGrid) {
  var dR = subGrid.length;
  var dC = subGrid[0].length;
  for (let r = startR; r < startR + dR; r++) {
    for (let c = startC; c < startC + dC; c++) {
      mainGrid[r][c] = subGrid[r - startR][c - startC];
    }
  }
}

function copyGrid(grid) {
  let newGrid = makeEmptyGrid(grid.length, grid[0].length);
  insertIntoGrid(newGrid, 0, 0, grid);
  return newGrid;
}

function getBorderAsString(tile: Tile, borderNumber, reversed = false) {
  grid = makeGridWithBorder(tile);
  grid = rotateGridClockwiseNTimes(grid, 4 - borderNumber); // trick to not write the counter clock wise rotation
  if (reversed) {
    return grid[0].reverse().join(",");
  } else {
    return grid[0].join(",");
  }
}

function makeImage(positions) {
  var [R, C] = gridSize(positions);
  var grid = makeEmptyGrid(8 * (R + 1), 8 * (C + 1));
  for (let r = 0; r < R + 1; r++) {
    for (let c = 0; c < C + 1; c++) {
      let tile = positions.get([r, c].join(","));
      var subGrid = makeGridWithoutBorders(tile);
      insertIntoGrid(grid, 8 * r, 8 * c, subGrid);
    }
  }
  console.log(
    "check for full Image (should be equal to part 1)",
    positions.get([0, 0].join(",")).id *
      positions.get([0, C].join(",")).id *
      positions.get([R, 0].join(",")).id *
      positions.get([R, C].join(",")).id
  );
  return grid;
}

function printGrid(grid) {
  for (let line of grid) {
    var lineStr = line.map((i) => {
      if (i == 0) {
        return ".";
      } else {
        return "#";
      }
    });
    console.log(lineStr.join(""));
  }
}

class Pattern {
  pattern: number[];
  dR: number;
  dC: number;
  constructor(str: string) {
    var lines = str.split("\n");
    var pattern = [];
    for (let r = 0; r < lines.length; r++) {
      for (let c = 0; c < lines[0].length; c++) {
        if (lines[r][c] === "#") {
          pattern.push([r, c]);
        }
      }
    }
    this.pattern = pattern;
    this.dR = lines.length;
    this.dC = lines[0].length;
  }
}

function matchPattern(
  grid: number[][],
  monsterPattern: Pattern,
  r: number,
  c: number
) {
  for (let rc of monsterPattern.pattern) {
    if (grid[r + rc[0]][c + rc[1]] !== 1) {
      return false;
    }
  }
  return true;
}

function findMonsters(grid, monsterPattern: Pattern) {
  var count = 0;
  for (let r = 0; r < grid.length - monsterPattern.dR + 1; r++) {
    for (let c = 0; c < grid.length - monsterPattern.dC + 1; c++) {
      if (matchPattern(grid, monsterPattern, r, c)) {
        count += 1;
      }
    }
  }
  return count;
}

function loadGrid(filename: string) {
  var grid = [];
  var lines = readFileSync(filename, "utf-8").trim().split("\n");
  const n = lines[0].length;
  for (let r = 0; r < n; r++) {
    var newLine = [];
    for (let c = 0; c < n; c++) {
      if (lines[r][c] === ".") {
        newLine.push(0);
      } else {
        newLine.push(1);
      }
    }
    grid.push(newLine);
  }
  return grid;
}

function countOnes(grid) {
  var n = grid[0].length;
  var count = 0;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] == 1) {
        count += 1;
      }
    }
  }
  return count;
}

// true start of part 2

// set corner tile arbitrarily and rotate it to make a top left corner
var currentTile = cornerTiles[0];
while (
  toHashCounts(currentTile, hashCounts).toString() !== [1, 2, 2, 1].toString()
) {
  currentTile.rotateRight();
}
// collect tiles that need to be matched
var remainingTiles = [];
for (let tile of tiles.values()) {
  if (tile.id != currentTile.id) {
    remainingTiles.push(tile);
  }
}
// set up the map from positions to tile
var positions = new Map();
positions.set([0, 0].toString(), currentTile);

const C = Math.sqrt(tiles.size);
var [r, c] = [0, 1];
// match tiles greedily
while (remainingTiles.length > 0) {
  var candidates = getCandidatesToRight(currentTile, remainingTiles);
  if (candidates.length !== 1) {
    currentTile.flipHorizontal();
    candidates = getCandidatesToRight(currentTile, remainingTiles);
    if (candidates.length !== 1) {
      console.log("impossible right");
      break;
    }
  }

  // rotate until it matches the right orientation
  var nextTile = candidates[0];
  while (nextTile.hashes[3] !== currentTile.hashes[1]) {
    nextTile.rotateRight();
  }
  // flip if the border is not correct
  while (
    getBorderAsString(nextTile, 3, true) !== getBorderAsString(currentTile, 1)
  ) {
    nextTile.flipVertical();
  }
  const index = remainingTiles.indexOf(nextTile);
  remainingTiles.splice(index, 1);
  positions.set([r, c].toString(), nextTile);
  if (remainingTiles.length > 0 && c === C - 1) {
    // reached end of the line, we have to match the bottom candidate from [r, 0]
    currentTile = positions.get([r, 0].toString());
    var candidatesBottom = getCandidatesToBottom(currentTile, remainingTiles);
    if (candidatesBottom.length !== 1) {
      currentTile.flipVertical();
      candidatesBottom = getCandidatesToBottom(currentTile, remainingTiles);
      if (candidatesBottom.length !== 1) {
        console.log("impossible bottom");
        break;
      }
    }
    nextTile = candidatesBottom[0];
    while (nextTile.hashes[0] !== currentTile.hashes[2]) {
      nextTile.rotateRight();
    }
    // flip if the bottom border is not correct
    while (
      getBorderAsString(nextTile, 0, true) !== getBorderAsString(currentTile, 2)
    ) {
      nextTile.flipHorizontal();
    }
    const index = remainingTiles.indexOf(nextTile);
    remainingTiles.splice(index, 1);
    r += 1;
    positions.set([r, 0].toString(), nextTile);
    c = 1;
    currentTile = nextTile;
  } else {
    c += 1;
    currentTile = nextTile;
  }
}

// for (let [position, tile] of positions) {
//   console.log(
//     "position:",
//     position,
//     "tile ID:",
//     tile.id,
//     "rotation",
//     tile.rotation,
//     "flipH",
//     tile.flipH,
//     "flipV",
//     tile.flipV
//   );
//}

var grid = makeImage(positions);

const monsterStr =
  "                  # \n#    ##    ##    ###\n #  #  #  #  #  #   ";

const monsterPattern = new Pattern(monsterStr);

let grid1 = rotateGridClockwiseNTimes(grid, 0);
let grid2 = rotateGridClockwiseNTimes(grid, 1);
let grid3 = rotateGridClockwiseNTimes(grid, 2);
let grid4 = rotateGridClockwiseNTimes(grid, 3);
let grid5 = flipVertical(grid1);
let grid6 = flipVertical(grid2);
let grid7 = flipVertical(grid3);
let grid8 = flipVertical(grid4);
for (let i = 0; i < 8; i++) {
  let tempGrid = [grid1, grid2, grid3, grid4, grid5, grid6, grid7, grid8][i];
  let nMonsters = findMonsters(tempGrid, monsterPattern);
  if (nMonsters > 0) {
    console.log(
      "Part 2:",
      "grid #",
      i,
      "monsters found:",
      nMonsters,
      "water roughness",
      countOnes(tempGrid) - nMonsters * monsterPattern.pattern.length
    );
  }
}

// what I've learned
// - doing the problem over multiple days made it so that I thought I had a working puzzle solver, but I didn't
// this was mostly due to the fact that I had tried to be clever with the border hashes and that
// I had forgotten to flip correctly while reassembling the tiles
// since I was lazy I also forgot to check that the borders were well matched before making the final image
// which led to a mess!
// trying to be faster led me to spend more time on the problem :(
