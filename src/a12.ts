import { readFileSync } from "fs";

const instructions = readFileSync("input/input12.txt", "utf-8")
  .trim()
  .split("\n");

class Position {
  x: number;
  y: number;
  direction: string;

  constructor(x, y, d) {
    this.x = x;
    this.y = y;
    this.direction = d;
  }
}

const UNIT_VECTORS = { N: [0, 1], S: [0, -1], E: [1, 0], W: [-1, 0] };
const NTURNS = { "90": 1, "180": 2, "270": 3 };
const DIRECTIONS = "NESW";

function applyInstruction(position: Position, instruction) {
  if ("NSEW".indexOf(instruction[0]) > -1) {
    var vec = UNIT_VECTORS[instruction[0]];
    var len = parseInt(instruction.slice(1));
    position.x += len * vec[0];
    position.y += len * vec[1];
  } else if (instruction[0] == "F") {
    var vec = UNIT_VECTORS[position.direction];
    var len = parseInt(instruction.slice(1));
    position.x += len * vec[0];
    position.y += len * vec[1];
  } else {
    console.assert(instruction.slice(1) in NTURNS);
    var nturns = NTURNS[instruction.slice(1)];
    if (instruction[0] == "R") {
      // rotate + direction
      var current = DIRECTIONS.indexOf(position.direction);
      position.direction = DIRECTIONS[(current + nturns) % 4];
    } else {
      var current = DIRECTIONS.indexOf(position.direction);
      position.direction = DIRECTIONS[(current - nturns + 4) % 4];
    }
  }
}

var position = new Position(0, 0, "E");
for (let instruction of instructions) {
  applyInstruction(position, instruction);
}

console.log("part 1:", Math.abs(position.x) + Math.abs(position.y));

// part 2, we now have a waypoint
class Waypoint {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

function applyInstructionPart2(
  position: Position,
  waypoint: Waypoint,
  instruction: string
) {
  if ("NSEWLR".indexOf(instruction[0]) > -1) {
    // waypoint moves
    if ("NSEW".indexOf(instruction[0]) > -1) {
      // translations
      var vec = UNIT_VECTORS[instruction[0]];
      var len = parseInt(instruction.slice(1));
      waypoint.x += len * vec[0];
      waypoint.y += len * vec[1];
    } else {
      // rotations
      console.assert(instruction.slice(1) in NTURNS);
      var nturns = NTURNS[instruction.slice(1)];
      if (instruction[0] == "R") {
        // rotate the waypoint in the + direction
        for (let i = 0; i < nturns; i++) {
          var [x, y] = [waypoint.x, waypoint.y];
          waypoint.x = y;
          waypoint.y = -x;
        }
      } else {
        for (let i = 0; i < nturns; i++) {
          var [x, y] = [waypoint.x, waypoint.y];
          waypoint.x = -y;
          waypoint.y = x;
        }
      }
    }
  } else if (instruction[0] == "F") {
    // ship moves
    var vec = [waypoint.x, waypoint.y];
    var len = parseInt(instruction.slice(1));
    position.x += len * vec[0];
    position.y += len * vec[1];
  }
}

var position = new Position(0, 0, "E");
var waypoint = new Waypoint(10, 1);
for (let instruction of instructions) {
  applyInstructionPart2(position, waypoint, instruction);
}

console.log("part 2:", Math.abs(position.x) + Math.abs(position.y));

// things I'v learnt today
// - wrote my first struct in typescript! (wrote 2 actually)
// - I was a bit disappointed that there seems no built-in complex number support in js (this may be wrong)
