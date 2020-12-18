import { sumArray } from "./util/util";
import { readFileSync } from "fs";
import { createBreak } from "typescript";

const homework = readFileSync("input/input18.txt", "utf-8").trim().split("\n");

function add(a: number, b: number) {
  return a + b;
}

function mult(a: number, b: number) {
  return a * b;
}

function splitParens(str: string) {
  // return string starting on parens until next close paren
  var count = 0;
  for (var i = 0; i < str.length; i++) {
    if (str[i] == "(") {
      count += 1;
    } else if (str[i] == ")") {
      count -= 1;
    }
    if (count == 0) {
      break;
    }
  }
  return str.slice(0, i + 1);
}

function splitIntoGroups(problem: string) {
  var remaining = problem;
  var groups = [];
  const p = /^(\d+|[+*]|\()/;
  while (remaining.length > 0) {
    var m = remaining.match(p);
    if (!(m === null)) {
      if (m[1] == "(") {
        // handle parens
        var group = splitParens(remaining);
        groups.push(group);
        remaining = remaining.slice(group.length).trim();
      } else {
        groups.push(m[1]);
        remaining = remaining.slice(m[1].length).trim();
      }
    } else {
      break;
    }
  }
  return groups;
}

function parseOp(str) {
  if (str == "*") {
    return mult;
  } else if (str == "+") {
    return add;
  }
}

function getNextGroupValue(groups) {
  // get next group and split remaining problem
  var nextGroup = groups.shift();
  // consume next group
  if (nextGroup.match(/\(/) === null) {
    var nextGroupValue = parseInt(nextGroup);
  } else {
    var nextGroupValue = computeValue(nextGroup.slice(1, nextGroup.length - 1));
  }
  return nextGroupValue;
}

function computeValue(problem: string) {
  var currentOp = add;
  var currentValue = 0;
  var groups = splitIntoGroups(problem);
  var nextGroupValue: number;
  while (groups.length > 2) {
    nextGroupValue = getNextGroupValue(groups);
    currentValue = currentOp(currentValue, nextGroupValue);
    // get next op and split remaining problem
    currentOp = parseOp(groups.shift());
  }
  // last remaining value needs to be op'ed
  nextGroupValue = getNextGroupValue(groups);
  currentValue = currentOp(currentValue, nextGroupValue);
  return currentValue;
}

console.log("Part 1:", sumArray(homework.map(computeValue)));

// part 2: we need to have precedence of + over *
// the idea is to reduce the plus first and then make a final pass over the remaining mults

function getNextGroupValuePlusHasPriority(groups) {
  // get next group and split remaining problem
  var nextGroup = groups.shift();
  // consume next group
  if (nextGroup.match(/\(/) === null) {
    var nextGroupValue = parseInt(nextGroup);
  } else {
    var nextGroupValue = computeValuePlusHasPriority(
      nextGroup.slice(1, nextGroup.length - 1)
    );
  }
  return nextGroupValue;
}

function computeValuePlusHasPriority(problem: string) {
  var groups = splitIntoGroups(problem);

  // do all the pluses first
  while (groups.filter((str) => str == "+").length > 0) {
    for (let i = 0; i < groups.length; i++) {
      if (groups[i] == "+") {
        let valueLeft = computeValuePlusHasPriority(groups[i - 1]);
        let valueRight = computeValuePlusHasPriority(groups[i + 1]);
        groups.splice(i - 1, 3, add(valueLeft, valueRight).toString());
        break;
      }
    }
  }
  // last remaining value needs to be op'ed with mult, let's use the previous code for that
  var currentOp = add;
  var currentValue = 0;
  var nextGroupValue: number;
  while (groups.length > 2) {
    nextGroupValue = getNextGroupValuePlusHasPriority(groups);
    currentValue = currentOp(currentValue, nextGroupValue);
    // get next op and split remaining problem
    currentOp = parseOp(groups.shift());
  }
  // last remaining value needs to be op'ed
  nextGroupValue = getNextGroupValuePlusHasPriority(groups);
  currentValue = currentOp(currentValue, nextGroupValue);
  return currentValue;
}

console.log("Part 2:", sumArray(homework.map(computeValuePlusHasPriority)));

// things I've learnt
// - using Array.filter is very useful (replaces list comprehension in Python!)
// - Array.splice deletes stuff and inserts other stuff where it deleted --> useful!!
// - I had forgotten how to match null regexps although I have used it before:
// if (nextGroup.match(/\(/) === null) {
