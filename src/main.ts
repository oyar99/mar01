// Author: Jhon
// Handles custom scroller logic relying on css animations
const profileButton: HTMLInputElement = <HTMLInputElement>(
  document.getElementById("button-profile")
);
const servicesButton: HTMLInputElement = <HTMLInputElement>(
  document.getElementById("button-services")
);
const educationButton: HTMLInputElement = <HTMLInputElement>(
  document.getElementById("button-education")
);

const WHEEL_DELTA_TRIGGER = 20;
const ANIMATION_TIME = 1400;
let isAnimationRunning =
  false; /* indicates whether we know the animation is running - it does not reliable tell if it is running */

type Gesture = "up" | "down";

const handleAnimation = (gesture: Gesture) => {
  if (isAnimationRunning) return;
  const startAnimationCounter = () => {
    isAnimationRunning = true;
    setTimeout(() => {
      isAnimationRunning = false;
    }, ANIMATION_TIME);
  };
  switch (true) {
    case gesture === "up":
      switch (true) {
        case educationButton?.checked:
          servicesButton?.click();
          startAnimationCounter();
          break;
        case servicesButton?.checked:
          profileButton?.click();
          startAnimationCounter();
          break;
      }
      break;
    case gesture === "down":
      switch (true) {
        case (!profileButton?.checked &&
          !servicesButton?.checked &&
          !educationButton?.checked) ||
          profileButton?.checked:
          servicesButton?.click();
          startAnimationCounter();
          break;
        case servicesButton?.checked:
          educationButton?.click();
          startAnimationCounter();
          break;
      }
  }
};
window.addEventListener("wheel", (event) => {
  switch (true) {
    case event.deltaY > WHEEL_DELTA_TRIGGER:
      handleAnimation("down");
      break;
    case event.deltaY < -WHEEL_DELTA_TRIGGER:
      handleAnimation("up");
      break;
  }
});

let previousTouchY = 0;
let deltaY = 0;

window.addEventListener("touchmove", (event) => {
  const currentTouchY = event.touches[0].clientY;
  deltaY = currentTouchY - previousTouchY;
  switch (true) {
    case deltaY > WHEEL_DELTA_TRIGGER:
      handleAnimation("down");
      break;
    case deltaY < -WHEEL_DELTA_TRIGGER:
      handleAnimation("up");
      break;
  }
  previousTouchY = currentTouchY;
});
