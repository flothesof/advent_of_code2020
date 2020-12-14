// run using node src/test.ts

// does sorting work as expected

var arr = [0, 1, 2234, 2, 3, 4];
arr.sort();
console.log(arr);
// [ 0, 1, 2, 2234, 3, 4 ]

var arr2 = new Int16Array([0, 1, 2234, 2, 3, 4]);
arr2.sort();
console.log(arr2);

// testing iterators on maps

console.log("maps");

var map = new Map();
map[1] = 2;
map[2] = 3;

// does not work
for (let i in map.values()) {
  console.log(i, map[i]);
}

// does work
for (let i in map) {
  console.log(i, map[i]);
}
