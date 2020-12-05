import { readFileSync } from "fs";

var lines = readFileSync("input/input03.txt", "utf-8").trim().split("\n");

var trees = new Set();

for (var r = 0; r < lines.length; r++) {
  var line = lines[r];
  for (var c = 0; c < line.length; c++) {
    if (line[c] == "#") {
      trees.add([r, c].toString());
    }
  }
}

function countCollisions(slope: number[]) {
  var pos = [0, 0];

  var collisions = 0;
  while (pos[0] < r) {
    pos[0] += slope[0];
    pos[1] = (pos[1] + slope[1]) % c;
    if (trees.has([pos[0], pos[1]].toString())) {
      collisions += 1;
    }
  }
  return collisions;
}

console.log("part 1:", countCollisions([1, 3]));

// part 2
var part2 =
  countCollisions([1, 1]) *
  countCollisions([1, 3]) *
  countCollisions([1, 5]) *
  countCollisions([1, 7]) *
  countCollisions([2, 1]);

console.log("part2:", part2);

// Things I've learned
// Sets in javascript also have the hashing problem they have in Python
// I had to resort to strings instead of tuples as I would ahve in Python
