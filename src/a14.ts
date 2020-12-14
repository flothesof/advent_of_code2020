import { readFileSync } from "fs";

var lines = readFileSync("input/input14.txt", "utf-8").trim().split("\n");

function updateMask(line: string) {
  mask = line.split("mask = ")[1];
}

function to_36bit(decimal_number: number) {
  var binary = [];
  for (let i = 0; i < 36; i++) {
    var floor = Math.floor(decimal_number / Math.pow(2, 35 - i));
    decimal_number = decimal_number - floor * Math.pow(2, 35 - i);
    binary.push(floor);
  }
  return binary;
}

function to_decimal(binary_number: number[]) {
  var decimal = 0;
  for (let i = 0; i < 36; i++) {
    decimal += binary_number[35 - i] * Math.pow(2, i);
  }
  return decimal;
}

function applyMask(input_binary) {
  var binary = [];
  for (let i = 0; i < 36; i++) {
    var maskValue = mask[i];
    if ("01".indexOf(maskValue) > -1) {
      binary.push(maskValue);
    } else {
      binary.push(input_binary[i]);
    }
  }
  return binary;
}

function writeValue(address, value) {
  console.assert(mask.length == 36);
  var value_binary = to_36bit(value);
  var masked_value_binary = applyMask(value_binary);
  memory[address] = to_decimal(masked_value_binary);
}

var mask = "";
var memory: Map<number, number> = new Map();
for (let line of lines) {
  if (line.startsWith("mask")) {
    updateMask(line);
  } else {
    var matches = line.match(/mem\[(\d+)] = (\d+)/);
    var [address, value] = [matches[1], matches[2]];
    writeValue(address, value);
  }
}

var sum = 0;
for (let key in memory) {
  sum += memory[key];
}
console.log("Part 1:", sum);

// part 2

function applyMaskToAddress(destination) {
  var binary = [];
  for (let i = 0; i < 36; i++) {
    var maskValue = mask[i];
    if (maskValue == "0") {
      binary.push(destination[i]);
    } else if (maskValue == "1") {
      binary.push(1);
    } else if (maskValue == "X") {
      binary.push("X");
    }
  }
  return binary;
}

function generateFloatingAddresses(maskedAddress) {
  var floatingIndices = [];
  for (let i in maskedAddress) {
    if (maskedAddress[i] == "X") {
      floatingIndices.push(i);
    }
  }
  var addresses: number[][] = [[...maskedAddress]];
  for (let index of floatingIndices) {
    var newAdresses = [];
    for (let addr of addresses) {
      var copiedAddr = [...addr];
      copiedAddr[index] = 0;
      newAdresses.push(copiedAddr);
      copiedAddr = [...addr];
      copiedAddr[index] = 1;
      newAdresses.push(copiedAddr);
    }
    addresses = newAdresses;
  }
  return addresses;
}

function writeValuePart2(destination, value) {
  console.assert(mask.length == 36);
  var maskedAddress = applyMaskToAddress(to_36bit(destination));
  var addresses = generateFloatingAddresses(maskedAddress);
  for (let address of addresses) {
    memory[to_decimal(address)] = value;
  }
}

var mask = "";
var memory: Map<number, number> = new Map();
for (let line of lines) {
  if (line.startsWith("mask")) {
    updateMask(line);
  } else {
    var matches = line.match(/mem\[(\d+)] = (\d+)/);
    var [address, value] = [matches[1], matches[2]];
    writeValuePart2(address, parseInt(value));
  }
}

var sum = 0;
for (let key in memory) {
  sum += memory[key];
}
console.log("Part 2:", sum);

// things I've learnt today
// - Math.pow does powers
// - Math.floor does floor (used in binary decomposition)
// - summing
