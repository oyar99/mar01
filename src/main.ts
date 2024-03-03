// Add a wheel event listener to the window
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

window.addEventListener("wheel", (event) => {
  if (isAnimationRunning) return;
  const startAnimationCounter = () => {
    isAnimationRunning = true;
    setTimeout(() => {
      isAnimationRunning = false;
    }, ANIMATION_TIME);
  };
  switch (true) {
    case event.deltaY < WHEEL_DELTA_TRIGGER * -1:
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
    case event.deltaY > WHEEL_DELTA_TRIGGER:
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
});
