// does sorting work as expected

var arr = [0, 1, 2234, 2, 3, 4];
arr.sort();
console.log(arr);
// [ 0, 1, 2, 2234, 3, 4 ]

var arr2 = new Int16Array([0, 1, 2234, 2, 3, 4]);
arr2.sort();
console.log(arr2);
