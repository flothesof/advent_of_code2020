import { readFileSync } from "fs";

var rules = readFileSync("input/input07.txt", "utf-8").trim().split("\n");

function parseColors(items: string) {
  var firstSplit = items.split(", ");
  if (firstSplit[0] == "no other bags.") {
    return [];
  } else {
    return firstSplit.map((item) => {
      var numberOfBags = parseInt(item.match(/\d+\s*/)[0]);
      var typeOfBag = item.split(/\d+\s*/)[1].split(/\s*bag/)[0];
      return [typeOfBag, numberOfBags];
    });
  }
}

var tree = {};
rules.forEach((rule) => {
  var [bagType, contains] = rule.split(" bags contain ");
  tree[bagType] = parseColors(contains);
});

function canHold(whatBag: string, whichContent: string) {
  if (tree[whatBag].length == 0) {
    return false;
  } else {
    for (let child of tree[whatBag]) {
      if (child[0] == whichContent) {
        return true;
      } else if (canHold(child[0], whichContent)) {
        return true;
      }
    }
    return false;
  }
}

var canContain = 0;
for (let key in tree) {
  if (canHold(key, "shiny gold")) {
    canContain += 1;
  }
}
console.log("part 1:", canContain);

function countBags(whatBag: string) {
  if (tree[whatBag].length == 0) {
    return 1;
  } else {
    var count = 1;
    for (let child of tree[whatBag]) {
      count += child[1] * countBags(child[0]);
    }
    return count;
  }
}

console.log("part 2:", countBags("shiny gold") - 1);

// what I learnt today
// - string.slice(0, -3) works just like Python's string operator
// - regexp parsing is not as easy as I thought
// - don't forget to put a return instruction in the forEach mapping!
// - it's quick to write regexp with /regexp/ as item.match(/\d+\s*/)
// - Objects work nicely as tree structures
