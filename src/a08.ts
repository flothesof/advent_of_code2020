import { readFileSync } from "fs";

const instructions = readFileSync("input/input08.txt", "utf-8")
  .trim()
  .split("\n");

function parseInstruction(
  currentInstruction: string,
  acc: number,
  currentLineNumber: number
) {
  var match = currentInstruction.match(/(nop|acc|jmp) (.\d+)/);

  var [op, arg] = [match[1], parseInt(match[2])];
  var jmp = 1;
  if (op == "nop") {
  } else if (op == "acc") {
    acc += arg;
  } else if (op == "jmp") {
    jmp = arg;
  }
  currentLineNumber += jmp;
  return [acc, currentLineNumber];
}

function runSource(instructions: string[]) {
  var acc = 0;
  var currentLineNumber = 0;
  var visitedLines = new Set([currentLineNumber]);
  var returnStatus: string;
  while (true) {
    var currentInstruction = instructions[currentLineNumber];
    [acc, currentLineNumber] = parseInstruction(
      currentInstruction,
      acc,
      currentLineNumber
    );
    if (!visitedLines.has(currentLineNumber)) {
      visitedLines.add(currentLineNumber);
      if (currentLineNumber == instructions.length) {
        returnStatus = "finished";
        break;
      }
    } else {
      returnStatus = "InfiniteLoop";
      break;
    }
  }
  return [acc, returnStatus];
}

console.log("part 1:", runSource(instructions));

// part2 let's modify all the sources and see what happens

for (let currentLineNumber in instructions) {
  var currentInstruction = instructions[currentLineNumber];
  var match = currentInstruction.match(/(nop|acc|jmp) (.\d+)/);
  var [op, arg] = [match[1], parseInt(match[2])];
  if (op == "nop" || op == "jmp") {
    var cloneInstructions = [...instructions];
    if (op == "nop") {
      cloneInstructions[currentLineNumber] = cloneInstructions[
        currentLineNumber
      ].replace("nop", "jmp");
    } else if (op == "jmp") {
      cloneInstructions[currentLineNumber] = cloneInstructions[
        currentLineNumber
      ].replace("jmp", "nop");
    }
    var [acc, returnStatus] = runSource(cloneInstructions);
    if (returnStatus == "finished") {
      console.log("part 2:", acc);
      break;
    }
  }
}

// things I've learnt
// - you can clone an array just like in Python cloneList = [...list]
// - assinging multiple items as a function output with [a, b] = multipleReturns()
// - it was nice to refactor the code for part1 after solving part1 with the simple code and adding stuff
// instead of trying to write more complicated code directly for part1 (not reflected in commited source :p)
