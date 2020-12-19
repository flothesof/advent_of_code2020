import { sumArray } from "./util/util";
import { readFileSync } from "fs";

const [rulesBlock, messages] = readFileSync("input/input19.txt", "utf-8")
  .trim()
  .split("\n\n");

function simplifyRule(rule: string, rulesMap) {
  if (rule.startsWith('"')) {
    return rule.slice(1, rule.length - 1);
  } else {
    var elements = rule.split(/\s/);
    var newRule = "(";
    for (let element of elements) {
      if (element === "|" || element === "+" || element === "*") {
        newRule += element;
      } else {
        newRule += simplifyRule(rulesMap.get(element), rulesMap);
      }
    }
    newRule += ")";
    return newRule;
  }
}

function makeRulesMap(rulesBlock) {
  return new Map(rulesBlock.split("\n").map((line) => line.split(": ")));
}

function makeRule(rulesMap, ruleKey) {
  while (rulesMap.get(ruleKey).match(/\d/) !== null) {
    var newRule0 = simplifyRule(rulesMap.get(ruleKey), rulesMap);
    rulesMap.set(ruleKey, newRule0);
  }
  return "^" + rulesMap.get(ruleKey);
}

function matchRule0(message: string, rule0) {
  const m = message.match(rule0);
  if (!(m === null)) {
    if (m[0] === message) {
      return 1;
    }
  }
  return 0;
}

const rulesMap = makeRulesMap(rulesBlock);
const rule0 = makeRule(rulesMap, "0");

console.log(
  "Part 1:",
  sumArray(
    messages
      .trim()
      .split("\n")
      .map((message) => matchRule0(message, rule0))
  )
);

// part 2

function applyRecursiveRules(message) {
  // first apply rule 42 as many times as possible, then rule 31, then check if
  // the results satisfies the rules
  var [count42, count31] = [0, 0];
  while (message.match(rule42) !== null) {
    var m = message.match(rule42);
    message = message.slice(m[0].length);
    count42 += 1;
  }
  while (message.match(rule31) !== null) {
    var m = message.match(rule31);
    message = message.slice(m[0].length);
    count31 += 1;
  }
  if (message.length > 0) {
    return 0;
  }
  if (count31 > 0) {
    if (count42 - count31 > 0) {
      return 1;
    }
  }
  return 0;
}

var rule42 = makeRule(rulesMap, "42");
var rule31 = makeRule(rulesMap, "31");

var sum = 0;
for (let message of messages.trim().split("\n")) {
  sum += applyRecursiveRules(message);
}
console.log("Part 2:", sum);

// what I learned today
// - a more difficult problem than I would have expected: an interesting combination of doing things by hand and doing things in an automated way
// - I basically reused the regex matching machinery in typescript, with a twist for part 2
// - I can copy strings with str.slice()
// - join is a method of array, not string like in Python (['Fire', 'Air', 'Water'].join('-') not "-".join(array)) funny :)
// - apparently some regex languages have builtin capability of matching recursive patterns ^^
