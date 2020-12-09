import { readFileSync } from "fs";

const preambleLength = 25;
const numbers = readFileSync("input/input09.txt", "utf-8")
  .trim()
  .split("\n")
  .map((line) => {
    return parseInt(line);
  });

function updatePreamble(preambleNumbers: number[], newNumber: number) {
  var old = preambleNumbers[0];
  var newPreambleNumbers = [...preambleNumbers.slice(1), newNumber];
  return newPreambleNumbers;
}

function isValidNumber(preambleNumbers: number[], testNumber: number): boolean {
  var set = new Set(preambleNumbers);
  for (let thisNumber of preambleNumbers) {
    if (set.has(testNumber - thisNumber)) {
      return true;
    }
  }
  return false;
}
var solutionToPart1;
var preambleNumbers = [];
for (let newNumber of numbers) {
  if (preambleNumbers.length < preambleLength) {
    preambleNumbers.push(newNumber);
  } else {
    if (!isValidNumber(preambleNumbers, newNumber)) {
      solutionToPart1 = newNumber;
      console.log("part 1:", newNumber);
      break;
    } else {
      preambleNumbers = updatePreamble(preambleNumbers, newNumber);
    }
  }
}

// part 2: a greedy algorithm
function sum(contiguousRange: number[]) {
  if (contiguousRange.length === 0) {
    return 0;
  } else {
    return contiguousRange.reduce((prev, current) => prev + current);
  }
}

var contiguousRange = [];
var currentIndex = 0;
while (true) {
  var currenSum = sum(contiguousRange);
  if (currenSum < solutionToPart1) {
    contiguousRange.push(numbers[currentIndex]);
    currentIndex += 1;
  } else if (currenSum > solutionToPart1) {
    contiguousRange = [...contiguousRange.slice(1)];
  } else if (currenSum == solutionToPart1) {
    console.log(
      "part 2:",
      Math.min(...contiguousRange) + Math.max(...contiguousRange)
    );
    break;
  }
}

// things I've learnt
// - use Math.min(...listOfNumbers)
// - compute the sum of a list with list.reduce((prev, curr)=> prev + current)
// NOTE : when using the => functions, either the result fits in the line and there's no explicit return statement
// or it doesn't and you need one
