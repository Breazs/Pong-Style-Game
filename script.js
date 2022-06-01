"use strict";

import Ball from "./Ball.js";
import Paddle from "./Paddle.js";

const ball = new Ball(document.getElementById("ball"));
const playerPaddle = new Paddle(document.getElementById("player-paddle"));
const computerPaddle = new Paddle(document.getElementById("computer-paddle"));
const playerScoreElem = document.getElementById("player-score");
const computerScoreElem = document.getElementById("computer-score");
const scoreCss = document.getElementById("score");
const starScreen = document.getElementById("start-screen");
const coin = document.getElementById("coin");
const arcade = document.getElementById("Pong-machine");
const arcadeRect = arcade.getBoundingClientRect();
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnRetry = document.querySelector(".retry");
const msgWin = document.getElementById("msgWin");
const msgLose = document.getElementById("msgLose");
const textGameScreen = document.getElementById("textGameScreen");

coin.setAttribute("draggable", false);

let start = false;
let clicked = false;
let x = 0;
let y = 0;
var myReq;
let intensity = 1;

function displayFlex(e) {
  return (e.style.display = "flex");
}

function displayBlock(e) {
  return (e.style.display = "block");
}

function displayNone(e) {
  return (e.style.display = "none");
}

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

// Defining what "lose" means
function isLose() {
  const rect = ball.rect();
  return rect.right >= window.innerWidth || rect.left <= 0;
}
// Increasing the score of the winner and reset the remains
function handleLose() {
  const rect = ball.rect();
  if (rect.right >= window.innerWidth) {
    playerScoreElem.textContent = parseInt(playerScoreElem.textContent) + 1;
  } else {
    computerScoreElem.textContent = parseInt(computerScoreElem.textContent) + 1;
  }
  ball.reset();
  computerPaddle.reset();
  intensity = 1;
}

const retry = function () {
  console.log("am fost apasat");
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
  ball.reset();
  computerPaddle.reset();
  intensity = 1;
  computerScoreElem.textContent = "0";
  playerScoreElem.textContent = "0";
};

// start-screen

starScreen.addEventListener(
  "mousemove",
  function (e) {
    if (clicked) {
      // Calculating the difference upwards
      coin.style.left = e.clientX + x + "px";
      coin.style.top = e.clientY + y + "px";
    }
  },
  true
);

coin.addEventListener("mousedown", function (e) {
  clicked = true;
  // subtracting offset
  x = coin.offsetLeft - e.clientX;
  y = coin.offsetTop - e.clientY;
});

coin.addEventListener(
  "mouseup",
  function (e) {
    clicked = false;

    const distance = Math.sqrt(
      ((arcadeRect.right - arcadeRect.left) / 2 + arcadeRect.left - coin.offsetLeft) *
        ((arcadeRect.right - arcadeRect.left) / 2 + arcadeRect.left - coin.offsetLeft) +
        ((arcadeRect.bottom - arcadeRect.top) / 2 + arcadeRect.top - coin.offsetTop) *
          ((arcadeRect.bottom - arcadeRect.top) / 2 + arcadeRect.top - coin.offsetTop)
    );
    console.log(Math.floor(distance));
    const isCoinInArcade = distance < 140;

    if (isCoinInArcade) {
      function startGame() {
        displayNone(starScreen);
        displayNone(coin);
        displayNone(arcade);
        displayFlex(scoreCss);
        displayBlock(playerScoreElem);
        displayBlock(computerScoreElem);
        displayBlock(textGameScreen);
        ball.ballElem.style.display = "block";
        playerPaddle.paddleElem.style.display = "block";
        computerPaddle.paddleElem.style.display = "block";
        // displayBlock(ball.ballElem);
        // displayBlock(playerPaddle);
        // displayBlock(computerPaddle);
        start = true;
      }

      // Game

      startGame();

      let lastTime;

      if (start) {
        function update(time) {
          if (lastTime != null) {
            // The difference between the last and the current frame witch is fluctuating
            const delta = time - lastTime;

            // Passing delta into the update function so we got it cover for framerate drops
            ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()]);
            // Computer is following the ball so it needs ball.y
            computerPaddle.update(delta, ball.y);
            // Getting the "hue" constiable from the css file and converting it
            const hue = parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue("--hue")
            );
            // Setting the hue's constue and adding intensity effect
            document.documentElement.style.setProperty(
              "--hue",
              hue + (delta * intensity++) / 10000
            );
            if (isLose()) handleLose();
          }
          lastTime = time;
          // Much accurate frames then setInterval()
          myReq = window.requestAnimationFrame(update);

          let gameover = computerScoreElem.innerHTML === "10" || playerScoreElem.innerHTML === "10";

          if (gameover) {
            myReq = window.requestAnimationFrame(update);
            window.cancelAnimationFrame(myReq);
            openModal();

            btnRetry.addEventListener("click", retry);
            overlay.addEventListener("click", retry);
            if (computerScoreElem.textContent === "10") {
              msgLose.classList.remove("hidden");
              msgWin.classList.add("hidden");
            } else if (playerScoreElem.textContent === "10") {
              msgWin.classList.remove("hidden");
              msgLose.classList.add("hidden");
            }
          }
        }

        // Making the left paddle's y position be the same as our mouse cursor
        document.addEventListener("mousemove", e => {
          // Converting the e.y's pixel constue into percentages
          playerPaddle.position = (e.y / window.innerHeight) * 100;
        });
        // myReq = window.requestAnimationFrame(update);
        window.requestAnimationFrame(update);
      }
    }
  }
  // true
);
