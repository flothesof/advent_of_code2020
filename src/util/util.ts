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

export class Counter {
  counts: Map<any, any>;

  constructor() {
    this.counts = new Map();
  }

  update(iterable) {
    for (let item of iterable) {
      if (this.counts.has(item)) {
        this.counts.set(item, this.counts.get(item) + 1);
      } else {
        this.counts.set(item, 1);
      }
    }
  }

  get(key) {
    if (this.counts.has(key)) {
      return this.counts.get(key);
    }
  }
}

export function stringHash(str: string) {
  var hash = 0,
    i,
    chr;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
