import { readFileSync } from "fs";
import { stringHash } from "./util/util";

function loadCards(filename: string) {
  const [player1Block, player2Block] = readFileSync(filename, "utf-8")
    .trim()
    .split("\n\n");

  var player1 = player1Block
    .trim()
    .split("\n")
    .slice(1)
    .map((str) => parseInt(str));
  var player2 = player2Block
    .trim()
    .split("\n")
    .slice(1)
    .map((str) => parseInt(str));

  return [player1, player2];
}

function playRound(player1, player2) {
  var top1 = player1.shift();
  var top2 = player2.shift();
  if (top1 > top2) {
    player1.push(top1);
    player1.push(top2);
  } else {
    player2.push(top2);
    player2.push(top1);
  }
  return [player1, player2];
}

var [player1, player2] = loadCards("input/input22.txt");
var turns = 0;
while (!(player1.length == 0 || player2.length == 0)) {
  [player1, player2] = playRound(player1, player2);
  turns += 1;
}

function score(player: number[]) {
  var total = 0;
  var mult = 1;
  for (let i = 0; i < player.length; i++) {
    total += player[player.length - i - 1] * mult;
    mult += 1;
  }
  return total;
}

var score1 = score(player1);
var score2 = score(player2);
console.log("Part 1:", Math.max(score1, score2));

// part 2
function hash(player1, player2) {
  var str = player1.join("-") + ":" + player2.join("");
  return stringHash(str);
}

function playRoundRecursive(player1, player2, seen) {
  var player1Wins = false;
  if (seen.has(hash(player1, player2))) {
    // player 1 wins due to loop
    return [true, true];
  } else {
    seen.add(hash(player1, player2));
    var top1 = player1.shift();
    var top2 = player2.shift();
    if (player1.length >= top1 && player2.length >= top2) {
      var recTurns = 0;
      var recSeen = new Set();
      var recPlayer1 = [...player1].slice(0, top1);
      var recPlayer2 = [...player2].slice(0, top2);
      var player1WinsDueToLoop, recPlayer1Wins;
      while (!(recPlayer1.length == 0 || recPlayer2.length == 0)) {
        [player1WinsDueToLoop, recPlayer1Wins] = playRoundRecursive(
          recPlayer1,
          recPlayer2,
          recSeen
        );
        if (player1WinsDueToLoop) {
          break;
        }
        recTurns += 1;
      }
      if (recPlayer1Wins) {
        player1.push(top1);
        player1.push(top2);
        player1Wins = true;
      } else {
        player2.push(top2);
        player2.push(top1);
        player1Wins = false;
      }
    } else {
      if (top1 > top2) {
        player1.push(top1);
        player1.push(top2);
        player1Wins = true;
      } else {
        player2.push(top2);
        player2.push(top1);
        player1Wins = false;
      }
    }
  }
  return [false, player1Wins];
}

var seen = new Set();
var [player1, player2] = loadCards("input/input22.txt");
var turns = 0;
while (!(player1.length == 0 || player2.length == 0)) {
  var [player1WinsDueToLoop, player1Wins] = playRoundRecursive(
    player1,
    player2,
    seen
  );
  if (player1WinsDueToLoop) {
    break;
  }
  turns += 1;
}

score1 = score(player1);
score2 = score(player2);
console.log("Part 2:", Math.max(score1, score2));
