const test_input = "389125467";
const input = "538914762";

class CircularLinkedList {
  nextIndex: Map<number, number>;
  index2Values: Map<number, number>;
  values2Index: Map<number, number>;
  maxValue: number;
  constructor(items: number[]) {
    this.nextIndex = new Map();
    this.index2Values = new Map();
    this.values2Index = new Map();
    this.maxValue = items[0];
    for (let index = 0; index < items.length; index++) {
      let item = items[index];
      this.index2Values.set(index, item);
      this.values2Index.set(item, index);
      if (index != items.length - 1) {
        this.nextIndex.set(index, index + 1);
      } else {
        this.nextIndex.set(index, 0);
      }
      this.maxValue = Math.max(this.maxValue, item);
    }
  }

  getValue(index) {
    return this.index2Values.get(index);
  }

  getNextIndex(index) {
    return this.nextIndex.get(index);
  }

  removeIndex(index) {
    let value = this.index2Values.get(index);
    this.values2Index.delete(value);
    this.index2Values.delete(index);
  }

  getIndex(value) {
    return this.values2Index.get(value);
  }

  insertAfter(index, indices, items) {
    var last = this.nextIndex.get(index);
    for (let i = 0; i < indices.length; i++) {
      this.nextIndex.set(index, indices[i]);
      index = indices[i];
      this.index2Values.set(index, items[i]);
      this.values2Index.set(items[i], index);
    }
    this.nextIndex.set(index, last);
    this.maxValue = Math.max(this.maxValue, ...indices);
  }
}

function makeCircle(input) {
  var items = [];
  for (let i = 0; i < input.length; i++) {
    items.push(parseInt(input[i]));
  }
  return new CircularLinkedList(items);
}

function pickUp3(circle: CircularLinkedList, currentIndex) {
  var index1 = circle.getNextIndex(currentIndex);
  var index2 = circle.getNextIndex(index1);
  var index3 = circle.getNextIndex(index2);
  var endIndex = circle.getNextIndex(index3);

  circle.nextIndex.set(currentIndex, endIndex);

  // update nextIndex manually
  circle.nextIndex.delete(index1);
  circle.nextIndex.delete(index2);
  circle.nextIndex.delete(index3);

  var pickedIndices = [index1, index2, index3];
  var pickedValues: number[] = [
    circle.getValue(index1),
    circle.getValue(index2),
    circle.getValue(index3),
  ];

  // update circular list by deleting stuff
  circle.removeIndex(index1);
  circle.removeIndex(index2);
  circle.removeIndex(index3);

  // update circle max
  while (pickedValues.indexOf(circle.maxValue) < -1) {
    circle.maxValue -= 1;
  }

  return {
    pickedIndices: pickedIndices,
    pickedValues: pickedValues,
    circle: circle,
  };
}

function computeDestination(currentValue, remainingCircle: CircularLinkedList) {
  var destinationValue = currentValue - 1;
  while (!remainingCircle.values2Index.has(destinationValue)) {
    destinationValue -= 1;
    if (destinationValue < 0) {
      destinationValue = remainingCircle.maxValue;
    }
  }
  return destinationValue;
}

function insertCups(
  destinationValue,
  pickedIndices,
  pickedCups,
  remainingCircle: CircularLinkedList
) {
  var destinationIndex = remainingCircle.getIndex(destinationValue);
  remainingCircle.insertAfter(destinationIndex, pickedIndices, pickedCups);
  return remainingCircle;
}

function move(circle: CircularLinkedList, currentIndex) {
  var currentValue = circle.getValue(currentIndex);
  var result = pickUp3(circle, currentIndex);
  var pickedIndices = result.pickedIndices;
  var pickedValues = result.pickedValues;
  var remainingCircle = result.circle;
  var destinationValue = computeDestination(currentValue, remainingCircle);
  circle = insertCups(
    destinationValue,
    pickedIndices,
    pickedValues,
    remainingCircle
  );
  currentIndex = circle.getIndex(currentValue);
  currentIndex = circle.getNextIndex(currentIndex);
  return [currentIndex, circle];
}

function outputPart1(circle: CircularLinkedList) {
  var index = circle.getNextIndex(circle.getIndex(1));
  var outstr = "";
  while (!(circle.getValue(index) === 1)) {
    outstr += circle.getValue(index);
    index = circle.getNextIndex(index);
  }
  return outstr;
}

function run(input, turns, inputMaker, outputMaker) {
  var circle = inputMaker(input);
  var currentIndex = 0;
  for (let turn = 0; turn < turns; turn++) {
    [currentIndex, circle] = move(circle, currentIndex);
  }
  return outputMaker(circle);
}
console.log(
  "Test 10 turns:",
  run(test_input, 10, makeCircle, outputPart1),
  92658374
);
console.log(
  "Test 100 turns:",
  run(test_input, 100, makeCircle, outputPart1),
  67384529
);
console.log("Part 1:", run(input, 100, makeCircle, outputPart1), 54327968);

// part 2

function makeCirclePart2(input) {
  var items = [];
  for (let i = 0; i < input.length; i++) {
    items.push(parseInt(input[i]));
  }
  for (let i = 10; i < 1000001; i++) {
    items.push(i);
  }
  return new CircularLinkedList(items);
}

function outputPart2(circle: CircularLinkedList) {
  var start = circle.getIndex(1);
  var one = circle.getNextIndex(start);
  var two = circle.getNextIndex(one);
  return circle.getValue(one) * circle.getValue(two);
}
console.log(
  "Test part 2:",
  run(test_input, 10000000, makeCirclePart2, outputPart2),
  149245887792
);

console.log("Part 2:", run(input, 10000000, makeCirclePart2, outputPart2));

// What I've learned
// - let's implement a linked list from scratch, yay!
// - I'm a bit troubled about how to have the ts compiler accept returns as arrays of different types
// (I've had this problem before so here I returned a dict with keys, but I'm not happy about it)
// - a Map can also test for inclusion with map.has() just like set
