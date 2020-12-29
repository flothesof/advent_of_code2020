import { readFileSync } from "fs";

function transformSubjectNumber(subjectNumber: number, loopSize: number) {
  let value = 1;
  for (let i = 0; i < loopSize; i++) {
    value = (value * subjectNumber) % 20201227;
  }
  return value;
}

// tests
var cardPublicKey = 5764801;
var cardLoopSize = 8;
console.assert(transformSubjectNumber(7, cardLoopSize) === cardPublicKey);
var doorPublicKey = 17807724;
var doorLoopSize = 11;
console.assert(transformSubjectNumber(7, doorLoopSize) === doorPublicKey);
var cardEncryptionKey = transformSubjectNumber(doorPublicKey, cardLoopSize);
var doorEncryptionKey = transformSubjectNumber(cardPublicKey, doorLoopSize);
console.assert(cardEncryptionKey === doorEncryptionKey);

function crackLoopSize(publicKey) {
  var loopSize = 1;
  var value = 1;
  value = (value * 7) % 20201227;
  while (value !== publicKey) {
    loopSize += 1;
    value = (value * 7) % 20201227;
  }
  return loopSize;
}

console.assert(crackLoopSize(cardPublicKey) === cardLoopSize);
console.assert(crackLoopSize(doorPublicKey) === doorLoopSize);

// solving
var secretKeys = readFileSync("input/input25.txt", "utf-8")
  .trim()
  .split("\n")
  .map(parseFloat);

const firstLoopSize = crackLoopSize(secretKeys[0]);
const secondLoopSize = crackLoopSize(secretKeys[1]);

var firstEncryptionKey = transformSubjectNumber(secretKeys[0], secondLoopSize);
var secondEncryptionKey = transformSubjectNumber(secretKeys[1], firstLoopSize);

console.assert(firstEncryptionKey === secondEncryptionKey);
console.log("Part 1:", firstEncryptionKey);
