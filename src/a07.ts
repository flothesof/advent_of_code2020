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
      return typeOfBag;
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
      if (child == whichContent) {
        return true;
      } else if (canHold(child, whichContent)) {
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
