import { readFileSync } from "fs";
import { start } from "repl";

var lines = readFileSync("input/input13.txt", "utf-8").trim().split("\n");
const departureTime = parseInt(lines[0]);

var busIds = [];
var offsets = [];
var offset = 0;
for (let val of lines[1].split(",")) {
  if (val != "x") {
    busIds.push(parseInt(val));
    offsets.push(offset);
  }
  offset += 1;
}

function argMax(array) {
  return [].reduce.call(array, (m, c, i, arr) => (c > arr[m] ? i : m), 0);
}

function argMin(array) {
  return [].reduce.call(array, (m, c, i, arr) => (c < arr[m] ? i : m), 0);
}

var timeToNextDepartures = busIds.map(
  (id) => (Math.floor(departureTime / id) + 1) * id - departureTime
);
var argmin = argMin(timeToNextDepartures);
console.log("part 1:", timeToNextDepartures[argmin] * busIds[argmin]);

// part 2

function findMinTime(startTime, increment, divisor, offset) {
  var t = startTime;
  while ((t + offset) % divisor != 0) {
    t += increment;
  }
  return [t, increment * divisor];
}

var startTime = 0;
var increment = busIds[0];
var divisor = busIds[1];
offset = offsets[1];

for (let i = 2; i < busIds.length; i++) {
  [startTime, increment] = findMinTime(startTime, increment, divisor, offset);
  divisor = busIds[i];
  offset = offsets[i];
}
[startTime, increment] = findMinTime(startTime, increment, divisor, offset);
console.log("part 2:", startTime);

// solved thanks to advice from https://www.reddit.com/r/adventofcode/comments/kc60ri/2020_day_13_can_anyone_give_me_a_hint_for_part_2/
// things I've learned
// - I should put the argmax and argmin functions in an util class for reuse
// - I think this "greedy" algorithm ultimately comes from Bézout's identity https://en.wikipedia.org/wiki/Bézout%27s_identity
// which says that the solutions to ax + by = 1 have a 1D structure once you have found a solution (there's a geometrical analogy with a line in the plane here)
// - what the solution does is that it greedily searches for the smallest valid departure time between two constraints
// - once a solution is found, the new increment choosen makes it so that the next incremented number is also a solution to the already used relationship
// - so in the end, by this greedy strategy, the increment numbers satisfy all modulo equations at once!
// - I should definitely ankify some of the things above, in particular Bézout's identity (possibly also the Chinese remainder theorem, but I'm not sure how it's related)
