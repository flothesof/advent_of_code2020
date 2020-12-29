import { readFileSync } from "fs";

function makePairs(input) {
  var foods = readFileSync(input, "utf-8").trim().split("\n");

  var pairs = foods.map((food) => {
    var [ingredientsBlock, allergensBlock] = food.split(" (contains ");
    var ingredients = ingredientsBlock.trim().split(" ");
    var allergens = allergensBlock
      .slice(0, allergensBlock.length - 1)
      .split(", ");
    return [ingredients, allergens];
  });
  return pairs;
}

function setIntersection(set1, set2) {
  return new Set([...set1].filter((x) => set2.has(x)));
}

function setUnion(set1, set2) {
  return new Set([...set1, ...set2]);
}

function setDifference(set1, set2) {
  return new Set([...set1].filter((x) => !set2.has(x)));
}

function applyPairs(pairs, candidates) {
  pairs.forEach((pair) => {
    let [ingredients, allergens] = pair;
    let ingredientSet = new Set(ingredients);
    for (let allergen of allergens) {
      if (!candidates.has(allergen)) {
        candidates.set(allergen, ingredientSet);
      } else {
        let currentCandidates = candidates.get(allergen);
        candidates.set(
          allergen,
          setIntersection(currentCandidates, ingredientSet)
        );
      }
    }
  });
}

const pairs = makePairs("input/input21.txt");
var candidates = new Map();
applyPairs(pairs, candidates);
console.log(candidates);
var knownAllergens = new Set(candidates.values().next().value);
for (let set of candidates.values()) {
  knownAllergens = setUnion(knownAllergens, set);
}

var count = 0;
pairs.forEach((pair) => {
  let [ingredients, allergens] = pair;
  for (let ingredient of ingredients) {
    if (!knownAllergens.has(ingredient)) {
      count += 1;
    }
  }
});

console.log("Part 1", count);

function solve(candidates: Map<string, Set<string>>) {
  var allergen2ingredient = new Map();
  while (candidates.size > 0) {
    for (var [key, value] of candidates.entries()) {
      value = setDifference(value, new Set(allergen2ingredient.values()));
      if (value.size == 1) {
        let ingredient = [...value][0];
        allergen2ingredient.set(key, ingredient);
        break;
      }
    }
    candidates.delete(key);
  }
  return allergen2ingredient;
}

var allergen2ingredient = solve(candidates);

var ingredients = [];
for (let key of [...allergen2ingredient.keys()].sort()) {
  ingredients.push(allergen2ingredient.get(key));
}
console.log("Part 2:", ingredients.join(","));

// what I've learned today
// - js has missing set operations, but a helpful resource about them is here: https://exploringjs.com/impatient-js/ch_sets.html#missing-set-operations
