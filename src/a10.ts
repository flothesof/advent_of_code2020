import { readFileSync } from "fs";

var chargers = readFileSync("input/input10.txt", "utf-8")
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

function generatePossibleChainsExplicitly(chains: number[][]) {
  for (let chain of chains) {
    var last = chain[chain.length - 1];
    if (last == highestRated) {
      return chains;
    } else {
      var newChains = [];
      for (let nextVal of [last + 1, last + 2, last + 3]) {
        if (availableNodes.has(nextVal)) {
          var newChain = [...chain];
          newChain.push(nextVal);
          var newLocalChains = generatePossibleChainsExplicitly([newChain]);
          for (let otherChain of newLocalChains) {
            newChains.push(otherChain);
          }
        }
      }
      return newChains;
    }
  }
}

// this does not work on the large input file
// var chains = [[0]];
// var availableSet = new Set(chargers);
// generatePossibleChainsExplicitly(chains)

function depthFirstSearch(availableNodes, discovered, currentNode) {
  if (currentNode == highestRated) {
    discovered[currentNode] = 1;
    return;
  }
  for (let n of [currentNode + 1, currentNode + 2, currentNode + 3]) {
    if (availableNodes.has(n)) {
      if (n in discovered) {
        discovered[currentNode] += discovered[n];
      } else {
        depthFirstSearch(availableNodes, discovered, n);
        discovered[currentNode] = discovered[n];
      }
    }
  }
}
var availableNodes = new Set(chargers);
var discovered = {};
depthFirstSearch(availableNodes, discovered, 0);
console.log("part 2:", discovered[0]);
