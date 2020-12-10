import { readFileSync } from "fs";

var chargers = readFileSync("input/input10_test1.txt", "utf-8")
  .trim()
  .split("\n")
  .map((str) => parseInt(str));

const highestRated = Math.max(...chargers) + 3;
chargers = [0, ...chargers];
chargers.push(highestRated);

chargers.sort((a, b) => a - b);

var diffs = {};
for (let i = 0; i < chargers.length - 1; i++) {
  let delta = chargers[i + 1] - chargers[i];
  let count = diffs[delta];
  diffs[delta] = count ? count + 1 : 1;
}
console.log("part 1:", diffs[1] * diffs[3]);

// part 2

const [start, finish] = [0, highestRated];

var chains = [[0]];
var availableSet = new Set(chargers);

function generatePossible(chains: number[][]) {
  for (let chain of chains) {
    var last = chain[chain.length - 1];
    if (last == highestRated) {
      return chains;
    } else {
      var newChains = [];
      for (let nextVal of [last + 1, last + 2, last + 3]) {
        if (availableSet.has(nextVal)) {
          var newChain = [...chain];
          newChain.push(nextVal);
          var newLocalChains = generatePossible([newChain]);
          for (let otherChain of newLocalChains) {
            newChains.push(otherChain);
          }
        }
      }
      return newChains;
    }
  }
}

function generatePossible2(chains: number[][]) {
  // each chain is a tuple: (lastValue, number of chains so far)
  for (let chain of chains) {
    var last = chain[0];
    if (last == highestRated) {
      return chains;
    } else {
      var newChains = [];
      for (let nextVal of [last + 1, last + 2, last + 3]) {
        if (availableSet.has(nextVal)) {
          newChains.push([nextVal, chain[1]]);
        }
      }
      return generatePossible2(newChains);
    }
  }
}
var chains2 = [[0, 1]];
var result = generatePossible2(chains2);
console.log(result.length, result);
