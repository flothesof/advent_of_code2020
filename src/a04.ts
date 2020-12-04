import { readFileSync } from "fs";

const input: String[] = readFileSync("input/input04.txt", "utf-8")
  .trim()
  .split("\n");

var passports = [];
var passport = {};
for (let i = 0; i < input.length; i++) {
  let line = input[i];
  if (line.length == 0) {
    passports.push(passport);
    passport = {};
  } else {
    let fields = line.split(" ").map((str) => str.split(":"));
    for (let field of fields) {
      passport[field[0]] = field[1];
    }
  }
}
// finish last passport
passports.push(passport);

var validPassports = 0;
for (let passport of passports) {
  let missingFields = [];
  for (let field of ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid", "cid"]) {
    if (!(field in passport)) {
      missingFields.push(field);
    }
  }
  if (missingFields.length == 0) {
    validPassports += 1;
  } else if (missingFields.length == 1) {
    if (missingFields[0] == "cid") {
      validPassports += 1;
    }
  }
}

console.log("part1:", validPassports);

// part 2 let's write a different validation loop
function isBetween(val: number, min: number, max: number) {
  return min <= val && val <= max;
}

function isValidHeight(hgt: string) {
  if (hgt.endsWith("in")) {
    return isBetween(parseInt(hgt.substring(0, hgt.indexOf("in"))), 59, 76);
  } else if (hgt.endsWith("cm")) {
    return isBetween(parseInt(hgt.substring(0, hgt.indexOf("cm"))), 150, 193);
  } else {
    return false;
  }
}

console.assert(isValidHeight("60in"));
console.assert(isValidHeight("190cm"));
console.assert(!isValidHeight("190in"));
console.assert(!isValidHeight("190"));

function isValidHairColor(hcl: string) {
  const regex = "#[\\da-f]{6}";
  const found = hcl.match(regex);
  return !(found == null);
}

console.assert(isValidHairColor("#123abc"));
console.assert(!isValidHairColor("#123abz"));
console.assert(!isValidHairColor("123abc"));

function isValidPid(pid: string) {
  if (pid.length != 9) {
    return false;
  } else {
    return !(pid.match("[\\d]{9}") == null);
  }
}

function isValid(passport) {
  if (!isBetween(parseInt(passport["byr"]), 1920, 2002)) {
    return false;
  }
  if (!isBetween(parseInt(passport["iyr"]), 2010, 2020)) {
    return false;
  }
  if (!isBetween(parseInt(passport["eyr"]), 2020, 2030)) {
    return false;
  }
  if (!isValidHeight(passport["hgt"])) {
    return false;
  }
  if (!isValidHairColor(passport["hcl"])) {
    return false;
  }
  if (
    ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].indexOf(
      passport["ecl"]
    ) == -1
  ) {
    return false;
  }
  if (!isValidPid(passport["pid"])) {
    return false;
  }

  return true;
}

var validPassports = 0;
for (let passport of passports) {
  let missingFields = [];
  for (let field of ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid", "cid"]) {
    if (!(field in passport)) {
      missingFields.push(field);
    }
  }
  if (missingFields.length == 0) {
    if (isValid(passport)) {
      validPassports += 1;
    }
  } else if (missingFields.length == 1) {
    if (missingFields[0] == "cid") {
      if (isValid(passport)) {
        validPassports += 1;
      }
    }
  }
}

console.log("part2:", validPassports);

// things I've learnt
// - console.assert(bool), very useful in this puzzle
// - string.match(regexp), built-in, also quite useful
// - array.indexOf which returns -1 if not found
// - i've been bit by the match working but not being the right length
