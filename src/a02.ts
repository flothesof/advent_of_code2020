import { readFileSync } from "fs";

var input: String[] = readFileSync("input/input02.txt", "utf-8")
  .trim()
  .split("\n");

// part 1
var validPasswords = 0;
for (let line of input) {
  var splits = line.split(": ");
  var [minmax, letter] = splits[0].split(" ");
  var [min, max] = minmax.split("-").map((str) => parseInt(str));
  var password = splits[1];
  var counts = {};
  for (let l of password) {
    let count = counts[l];
    counts[l] = count ? count + 1 : 1;
  }
  if (min <= counts[letter] && counts[letter] <= max) {
    validPasswords += 1;
  }
}
console.log("part 1 - number of valid passwords:", validPasswords);

// part 2
var validPasswords = 0;
for (let line of input) {
  var splits = line.split(": ");
  var [minmax, letter] = splits[0].split(" ");
  var [min, max] = minmax.split("-").map((str) => parseInt(str));
  var password = splits[1];

  var [firstMatch, secondMatch] = [
    password[min - 1] == letter,
    password[max - 1] == letter,
  ];
  if (firstMatch != secondMatch) {
    validPasswords += 1;
  }
}
console.log("part 2 - number of valid passwords:", validPasswords);

// what I've learned in this puzzle
// - xor in JS is !=
// - ES6 allows destructuring assignment like so
// var [a, b, c] = str.split('-');
// - boolean and is && while or is ||
