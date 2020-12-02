import { readFileSync } from "fs";
var data = readFileSync("src/input01.txt", "utf8");

// part1
var set = new Set();
for (let n of data.split("\n").map((str) => parseInt(str))) {
  if (set.has(2020 - n)) {
    // found the right number for part 1
    console.log("part 1:", n * (2020 - n));
    break;
  } else {
    set.add(n);
  }
}

// part2

let sumof2 = {};
for (let n1 of data.split("\n").map((str) => parseInt(str))) {
  for (let n2 of data.split("\n").map((str) => parseInt(str))) {
    let n = n1 + n2;
    sumof2[n] = n1 * n2;
  }
}

var set = new Set();
for (let n of data.split("\n").map((str) => parseInt(str))) {
  if (2020 - n in sumof2) {
    // found the right number for part 2
    console.log("part 2:", n * sumof2[2020 - n]);
    break;
  } else {
    set.add(n);
  }
}

// what I've learned in this puzzle
// - typescript is also normal javascript
// - dict syntax is identical to Python
// - a set is a little different from Python
// - I haven't used any type annotation :(
// - vscode is not so easy to configure for a beginner...
