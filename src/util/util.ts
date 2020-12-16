export function argMax(array) {
  return [].reduce.call(array, (m, c, i, arr) => (c > arr[m] ? i : m), 0);
}

export function argMin(array) {
  return [].reduce.call(array, (m, c, i, arr) => (c < arr[m] ? i : m), 0);
}

export function sumArray(array: number[]) {
  let sum = 0;
  for (let val of array) {
    sum += val;
  }
  return sum;
}

export function prodArray(array: number[]) {
  var prod = 1;
  for (let val of array) {
    prod *= val;
  }
  return prod;
}
