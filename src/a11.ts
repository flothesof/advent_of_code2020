import { readFileSync } from "fs";

function load(path = "input/input11.txt") {
  var [R, C] = [0, 0];
  var lines = readFileSync(path, "utf-8").trim().split("\n");
  var seats = {};
  for (let r = 0; r < lines.length; r++) {
    R = Math.max(r, R);
    for (let c = 0; c < lines[r].length; c++) {
      C = Math.max(c, C);
      if (lines[r][c] == "L") {
        seats[[r, c].toString()] = 0;
      }
    }
  }
  return [seats, R, C];
}

function computeNeighbors(seatNumber, seats) {
  var [r, c] = seatNumber.split(",").map((s) => parseInt(s));
  var n = 0;
  for (let offset of [
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
  ]) {
    var [rr, cc] = offset;
    const key = [r + rr, c + cc].toString();
    if (key in seats) {
      if (seats[key] == 1) {
        n += 1;
      }
    }
  }
  return n;
}

function applyRules(seats) {
  var newSeats = {};
  for (let seatNumber in seats) {
    var neighbors = computeNeighbors(seatNumber, seats);
    if (seats[seatNumber] == 0 && neighbors == 0) {
      newSeats[seatNumber] = 1;
    } else if (seats[seatNumber] == 1 && neighbors >= 4) {
      newSeats[seatNumber] = 0;
    } else {
      newSeats[seatNumber] = seats[seatNumber];
    }
  }
  return newSeats;
}

function sumSeats(seats) {
  var sum = 0;
  for (let key in seats) {
    sum += seats[key];
  }
  return sum;
}

// part 1 main loop
var [seats, R, C] = load();
var occupied = sumSeats(seats);
while (true) {
  seats = applyRules(seats);
  if (sumSeats(seats) == occupied) {
    break;
  } else {
    occupied = sumSeats(seats);
  }
}
console.log("part 1:", sumSeats(seats));

// part 2 starts here
function computeNeighborsPart2(seatNumber, seats, R: number, C: number) {
  var [r, c] = seatNumber.split(",").map((s) => parseInt(s));
  var n = 0;
  for (let offset of [
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
  ]) {
    var [rr, cc] = offset;
    var alpha = 1;
    var outOfBounds = false;
    while (true) {
      var coord = [r + alpha * rr, c + alpha * cc];
      var key = coord.toString();
      if (key in seats) {
        break;
      }
      if (coord[0] > R || coord[0] < 0 || coord[1] > C || coord[1] < 0) {
        outOfBounds = true;
        break;
      }
      alpha += 1;
    }
    if (!outOfBounds) {
      if (seats[key] == 1) {
        n += 1;
      }
    }
  }
  return n;
}

function applyRulesPart2(seats, R, C) {
  var newSeats = {};
  for (let seatNumber in seats) {
    var neighbors = computeNeighborsPart2(seatNumber, seats, R, C);
    if (seats[seatNumber] == 0 && neighbors == 0) {
      newSeats[seatNumber] = 1;
    } else if (seats[seatNumber] == 1 && neighbors >= 5) {
      newSeats[seatNumber] = 0;
    } else {
      newSeats[seatNumber] = seats[seatNumber];
    }
  }
  return newSeats;
}

var [seats, R, C] = load();
var occupied = sumSeats(seats);
while (true) {
  seats = applyRulesPart2(seats, R, C);
  if (sumSeats(seats) == occupied) {
    break;
  } else {
    occupied = sumSeats(seats);
  }
}
console.log("part 2:", sumSeats(seats));

// what I've learnt today
// - precedence rules if (coord[0] > R || coord[0] < 0 || coord[1] > C || coord[1] < 0)
