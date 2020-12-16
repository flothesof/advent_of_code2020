import { readFileSync } from "fs";

import { argMax, sumArray, prodArray } from "./util/util";

var pattern = /(\w*\s*(?:\w)*):\s(\d*)-(\d*) or (\d*)-(\d*)/;

var lines = readFileSync("input/input16.txt", "utf-8").trim().split("\n");

var readingHeader = true;
var readingTicket = false;
var readingOtherTickets = false;

var rules = [];
var ruleNames: string[] = [];
var otherTickets = [];

for (let line of lines) {
  if (line == "") {
    readingHeader = false;
  } else if (line == "your ticket:") {
    readingTicket = true;
    continue;
  } else if (line == "nearby tickets:") {
    readingOtherTickets = true;
    continue;
  }
  if (readingHeader) {
    let m = line.match(pattern);
    ruleNames.push(m[1]);
    rules.push([
      [parseInt(m[2]), parseInt(m[3])],
      [parseInt(m[4]), parseInt(m[5])],
    ]);
  } else if (readingTicket) {
    var myTicket = line.split(",").map((val) => parseInt(val));
    readingTicket = false;
  } else if (readingOtherTickets) {
    otherTickets.push(line.split(",").map((val) => parseInt(val)));
  }
}

function isValidRule(value: number, rule) {
  if (
    (value >= rule[0][0] && value <= rule[0][1]) ||
    (value >= rule[1][0] && value <= rule[1][1])
  ) {
    return true;
  } else {
    return false;
  }
}

function checkInvalidForAnyRule(ticket: number[]) {
  var invalidFields = [];
  for (let value of ticket) {
    let countInvalid = 0;
    for (let i = 0; i < rules.length; i++) {
      if (!isValidRule(value, rules[i])) {
        countInvalid += 1;
      }
    }
    if (countInvalid == rules.length) {
      invalidFields.push(value);
    }
  }
  return invalidFields;
}

var sumInvalidValues = 0;
var validTickets = [];
for (let i = 0; i < otherTickets.length; i++) {
  var otherTicket = otherTickets[i];
  let invalidFields = checkInvalidForAnyRule(otherTicket);
  if (invalidFields.length === 0) {
    validTickets.push(otherTicket);
  }
  for (let field of invalidFields) {
    sumInvalidValues += field;
  }
}

console.log("Part 1:", sumInvalidValues);

function checkInvalid(ticket: number[], rule) {
  for (let value of ticket) {
    if (!isValidRule(value, rule)) {
      return true;
    }
  }
  return false;
}

var compatibilityMatrix = [];
for (let r = 0; r < rules.length; r++) {
  let rule = rules[r];
  let thisRow = [];
  for (let c = 0; c < rules.length; c++) {
    let columnValues = validTickets.map((vals) => vals[c]);
    if (checkInvalid(columnValues, rule)) {
      thisRow.push(0);
    } else {
      thisRow.push(1);
    }
  }
  compatibilityMatrix.push(thisRow);
}

function solve(compatibilityMatrix: number[][]) {
  // init
  var assigned = new Map();
  var unassigned = [];
  for (let r = 0; r < compatibilityMatrix.length; r++) {
    unassigned.push(r);
  }
  // loop until we have greedily solved the system
  while (unassigned.length > 0) {
    for (let r = 0; r < compatibilityMatrix.length; r++) {
      // if there's only a single solution, take it
      if (sumArray(compatibilityMatrix[r]) == 1) {
        let argmax = argMax(compatibilityMatrix[r]);
        // delete this rule, which has been assigned
        const index = unassigned.indexOf(argmax);
        unassigned.splice(index, 1);
        // update the matrix to eliminate this rule from possible values
        for (let rr = 0; rr < compatibilityMatrix.length; rr++) {
          compatibilityMatrix[rr][argmax] = 0;
        }
        // save the rule to output variable
        assigned.set(r, argmax);
        break;
      }
    }
  }
  return assigned;
}

var assigned = solve(compatibilityMatrix);
var filtered = [];
for (let r = 0; r < ruleNames.length; r++) {
  if (ruleNames[r].startsWith("departure")) {
    filtered.push(myTicket[assigned.get(r)]);
  }
}

console.log("Part 2:", prodArray(filtered));

// what I learned today
// - I am rolling my own util.ts from today!
// - the solution to part 2 was sort of an assignment problem solver https://en.wikipedia.org/wiki/Assignment_problem
// - it helped to solve it with pen and (digital) paper first before coding the solver
