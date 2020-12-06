import { readFileSync } from "fs";

var lines = readFileSync("input/input06.txt", "utf-8").trim().split("\n\n");

var sum_part1 = 0;
var sum_part2 = 0;
lines.forEach((line) => {
  // part 1
  var splits = line.split("\n");
  var cleaned = "".concat(...splits);
  var set = new Set(cleaned);
  sum_part1 += set.size;

  // part 2
  const groupLength = splits.length;
  var counts = {};
  for (let l of cleaned) {
    let count = counts[l];
    counts[l] = count ? count + 1 : 1;
  }
  for (let val in counts) {
    if (counts[val] == groupLength) {
      sum_part2 += 1;
    }
  }
});

console.log(sum_part1);
console.log(sum_part2);

// things I've learnt in this one:
// - "".concat(...strArray) is like Python "".join(["a", "b"])  and useful
// - set has a size property, not a length property!
// - the counter pattern using an object is quite useful
