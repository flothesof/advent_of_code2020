import { readFileSync } from "fs";

//const input = [0, 3, 6];
const input = [13, 0, 10, 12, 1, 5, 8];

function computeNth(input, N) {
  var memory: Map<number, number> = new Map(); // from given value to last turn it was played

  for (let i = 0; i < input.length; i++) {
    memory.set(input[i], i + 1); // turns start at 1
  }

  var previous = input[input.length - 1];
  var current = undefined;
  var age = undefined;
  var turn = input.length;
  var hasntBeenPlayed = true;
  while (turn < N) {
    turn += 1; // turn starts here
    if (hasntBeenPlayed) {
      current = 0;
    } else {
      current = age;
    }
    if (memory.has(current)) {
      hasntBeenPlayed = false;
      age = turn - memory.get(current);
    } else {
      hasntBeenPlayed = true;
    }
    memory.set(current, turn);
    previous = current;
  }
  return current;
}

console.log("part 1:", computeNth(input, 2020));
console.log("part 2:", computeNth(input, 30000000));

// things I've learnt today
// - I haven't used Map correctly again: always use map.set(key, value) instead of map[key] = value!!!
