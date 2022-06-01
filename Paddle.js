"use strict";

const SPEED = 0.0115;

export default class Paddle {
  constructor(paddleElem) {
    this.paddleElem = paddleElem;
    this.reset();
  }

  get position() {
    // Getting the "position" variable from the css file, converting it and return it
    return parseFloat(getComputedStyle(this.paddleElem).getPropertyValue("--position"));
  }

  set position(value) {
    this.paddleElem.style.setProperty("--position", value);
  }

  rect() {
    // Getting info about the position of the rectangle (aka paddle) relative to the viewport
    return this.paddleElem.getBoundingClientRect();
  }

  reset() {
    this.position = 50;
  }

  update(delta, ballHeight) {
    // Setting a max speed so the computer can be beaten
    this.position += SPEED * delta * (ballHeight - this.position);
  }
}
