import { readFileSync } from "fs";

function splitDirections(line) {
  const pattern = /^(e|se|sw|w|nw|ne)/;
  var match = line.match(pattern);
  var dirs = [];
  while (match !== null) {
    dirs.push(match[0]);
    line = line.slice(match[0].length);
    match = line.match(pattern);
  }
  return dirs;
}

function computeCoords(line) {
  var dirs = splitDirections(line);
  const dir2coord = {
    e: [1, 0],
    w: [-1, 0],
    ne: [0, 1],
    nw: [-1, 1],
    sw: [0, -1],
    se: [1, -1],
  };
  var [u, v] = [0, 0];
  for (let dir of dirs) {
    let uv = dir2coord[dir];
    u += uv[0];
    v += uv[1];
  }
  return [u, v];
}

var lines = readFileSync("input/input24.txt", "utf-8").trim().split("\n");

var flippedTiles = new Set();
lines.forEach((str) => {
  var c = computeCoords(str);
  var key = c.join(":");
  if (flippedTiles.has(key)) {
    flippedTiles.delete(key);
  } else {
    flippedTiles.add(key);
  }
});

console.log("Part 1:", flippedTiles.size);

// Part 2: game of life on the hexgrid

function key2Coord(key) {
  return key.split(":").map(parseFloat);
}

function computeBounds(tiles: Set<string>) {
  let iter = tiles.keys();
  let tile = iter.next().value;
  let uv = key2Coord(tile);
  let [umin, umax, vmin, vmax] = [uv[0], uv[0], uv[1], uv[1]];
  for (let tile of iter) {
    uv = key2Coord(tile);
    umin = Math.min(umin, uv[0]);
    umax = Math.max(umax, uv[0]);
    vmin = Math.min(vmin, uv[1]);
    vmax = Math.max(vmax, uv[1]);
  }
  return [umin, umax, vmin, vmax];
}

function computeNeighbors(u, v, flippedTiles) {
  const uvs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [-1, 1],
    [0, -1],
    [1, -1],
  ];
  let n = 0;
  for (let uv of uvs) {
    let key = [u + uv[0], v + uv[1]].join(":");
    if (flippedTiles.has(key)) {
      n += 1;
    }
  }
  return n;
}

function step(flippedTiles) {
  var newFlippedTiles: Set<string> = new Set();
  var [umin, umax, vmin, vmax] = computeBounds(flippedTiles);
  for (let u = umin - 1; u < umax + 2; u++) {
    for (let v = vmin - 1; v < vmax + 2; v++) {
      let key = [u, v].join(":");
      let n = computeNeighbors(u, v, flippedTiles);
      if (flippedTiles.has(key)) {
        // it's a black tile
        if (!(n === 0 || n > 2)) {
          newFlippedTiles.add(key);
        }
      } else {
        // it's a white tile
        if (n === 2) {
          newFlippedTiles.add(key);
        }
      }
    }
  }
  return newFlippedTiles;
}

for (let turn = 0; turn < 100; turn++) {
  flippedTiles = step(flippedTiles);
}

console.log("Part 2:", flippedTiles.size);

// things I've learned
// - first time using an iterator in js, to initialize args
// - iter.next() returns an Object with a .value and .done which is boolean
