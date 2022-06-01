"use strict";

const INITIAL_VELOCITY = 0.025;
const VELOCITY_INCREASE = 0.000005;

export default class Ball {
  constructor(ballElem) {
    this.ballElem = ballElem;
    this.reset();
  }

  get x() {
    // Getting the "x" variable from the css file, converting it and return it
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
  }

  set x(value) {
    this.ballElem.style.setProperty("--x", value);
  }

  get y() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"));
  }

  set y(value) {
    this.ballElem.style.setProperty("--y", value);
  }

  rect() {
    // Getting info about the position of the rectangle (a.k.a. ball) relative to the viewport
    return this.ballElem.getBoundingClientRect();
  }

  reset() {
    console.log("reset");
    this.x = 50;
    this.y = 50;
    this.direction = { x: 0, y: 0 };

    // Just a slight change in the direction wouldn't make the game very enjoyable
    while (Math.abs(this.direction.x) <= 0.3 || Math.abs(this.direction.x) >= 0.8) {
      // Setting the heading in radians and using trigonometry functions
      // to have a unit vector so the velocity is the only thing affecting the speed of the ball
      const heading = randomNumberBetween(0, 2 * Math.PI);
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
    }
    this.velocity = INITIAL_VELOCITY;
  }

  update(delta, paddleRects) {
    this.x += this.direction.x * this.velocity * delta;
    this.y += this.direction.y * this.velocity * delta;
    // Increasing the ball's speed over time
    this.velocity += VELOCITY_INCREASE * delta;
    const rect = this.rect();
    let isCollisionPossible = true;

    if (rect.bottom >= window.innerHeight || rect.top <= 0) {
      this.direction.y *= -1;
    }
    // Looping through the paddles and "bounce" the ball back if it is colliding with one of them
    if (paddleRects.some(p => isCollisionPaddle(p, rect))) {
      this.direction.x *= -1;
    }
  }
}

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function isCollisionPaddle(paddle, ball) {
  // Defining collision between the paddle and the ball
  return (
    paddle.left <= ball.right &&
    paddle.right >= ball.left &&
    paddle.top <= ball.bottom &&
    paddle.bottom >= ball.top
  );
}
