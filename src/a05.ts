import { readFileSync } from "fs";

const boardingPasses: String[] = readFileSync("input/input05.txt", "utf-8")
  .trim()
  .split("\n");

const str2num = { F: 0, B: 1, L: 0, R: 1 };

function boardingPass2num(pass: String) {
  var mult = 64;
  var row = 0;
  for (let i = 0; i < 7; i++) {
    row += str2num[pass[i]] * mult;
    mult /= 2;
  }
  var mult = 4;
  var col = 0;
  for (let i = 7; i < 10; i++) {
    col += str2num[pass[i]] * mult;
    mult /= 2;
  }
  var seatId = row * 8 + col;
  return seatId;
}

console.assert(boardingPass2num("FBFBBFFRLR") == 357);

var seatIds = boardingPasses.map((pass) => boardingPass2num(pass));
var maxi = Math.max(...seatIds);
console.log("part1:", maxi);

seatIds.sort();
var diffs = [];
for (let i = 0; i < seatIds.length - 1; i++) {
  diffs[i] = seatIds[i + 1] - seatIds[i];
}

var seatLocation = diffs.indexOf(2);

console.log("part2:", seatIds[seatLocation] + 1);

// things I've learnt
// - first time writing the array.forEach((val)=>{dosomething(val);})
// - using array.sort() --> WOOOOPS I was lucky this time since sort operates on strings, not numbers!!!!
//    I should either use a new Int16Array or give a comparison function myself sort((a, b)=> a-b)
// - using Math.max()
// - figuring out how to do Math.max(...array), equivalent to Python f(*array)
