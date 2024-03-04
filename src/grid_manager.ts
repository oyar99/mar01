// Author: Jhon
// Handles the grid logic for mobile devices
import "hammerjs";
import { DIRECTION_LEFT, DIRECTION_RIGHT } from "hammerjs";

const MAX_ITEMS_GRID = 9;
const WAIT_TO_TRIGGER_SWIPE = 2000;
const isGridManagerEnabled = window.innerWidth <= 640;

let isAnimationRunning =
  false; /* indicates whether we know the animation is running - it does not reliable tell if it is running */

type SwipeDirection = "left" | "right";

function main() {
  let currentPosInGrid = 0;
  let lastDirection: SwipeDirection | undefined;
  let lastRealSwipe = 0;

  if (!isGridManagerEnabled) {
    return;
  }

  let manager: HammerManager;
  let swipe: SwipeRecognizer;

  const unsafeHandleProgrammaticSwipeEvent = (direction: SwipeDirection) =>
    handleSwipeEvent(
      {
        offsetDirection:
          direction === "left" ? DIRECTION_LEFT : DIRECTION_RIGHT,
      } as unknown as HammerInput,
      /* isProgrammatic */ true
    );

  const handleSwipeEvent = (e: HammerInput, isProgrammatic?: boolean) => {
    if (isAnimationRunning) return;
    const cachePrevPos = currentPosInGrid;
    const setIsAnimationRunning = (val: boolean) => {
      isAnimationRunning = val;
      setTimeout(() => {
        isAnimationRunning = !val;
      }, 900);
    };
    switch (e.offsetDirection) {
      case DIRECTION_RIGHT:
        switch (true) {
          case currentPosInGrid > 0:
            currentPosInGrid--;
            break;
        }
        lastDirection = "right";
        setIsAnimationRunning(true);
        break;
      case DIRECTION_LEFT:
        switch (true) {
          case currentPosInGrid < MAX_ITEMS_GRID - 1:
            currentPosInGrid++;
            break;
        }
        lastDirection = "left";
        setIsAnimationRunning(true);
        break;
    }
    cachePrevPos !== currentPosInGrid && rerender();
    cachePrevPos !== currentPosInGrid &&
      !isProgrammatic &&
      (() => {
        lastRealSwipe = Date.now();
      })();
  };

  const instantiateSwipeManager = () => {
    manager = new Hammer.Manager(document.getElementById(`services-section`)!);
    swipe = new Hammer.Swipe();
    manager.add(swipe);
    manager.on("swipe", handleSwipeEvent);
  };

  const rerender = () => {
    const el = <HTMLElement>(
      document.getElementById(`gi-${currentPosInGrid + 1}`)?.parentNode!
    );
    const prev =
      lastDirection &&
      <HTMLElement>(
        document.getElementById(
          `gi-${
            lastDirection === "right" ? currentPosInGrid + 2 : currentPosInGrid
          }`
        )?.parentNode!
      );

    const animationClassForPrev =
      lastDirection === "right" ? "slideOutRight-mb" : "slideOutLeft-mb";
    const animationClassForCurr =
      lastDirection === "right" ? "slideInFromLeft-mb" : "slideInFromRight-mb";

    prev?.classList.add(animationClassForPrev);
    el?.classList.add(animationClassForCurr);
    el?.classList.remove("hidden-mb");
    setTimeout(() => {
      prev?.classList.remove(animationClassForPrev);
      prev?.classList.add("hidden-mb");
      el?.classList.remove(animationClassForCurr);
    }, 1000);

    // Update pagination controls
    lastDirection &&
      document
        .getElementById(
          `grid-item-control-${
            lastDirection === "right" ? currentPosInGrid + 2 : currentPosInGrid
          }`
        )
        ?.classList.remove("active");
    document
      .getElementById(`grid-item-control-${currentPosInGrid + 1}`)
      ?.classList.add("active");
  };

  setInterval(() => {
    // Only trigger programmatic swipe if the user hasn't engaged with the content in the last 2 seconds
    lastRealSwipe + WAIT_TO_TRIGGER_SWIPE < Date.now() &&
      unsafeHandleProgrammaticSwipeEvent(
        currentPosInGrid === MAX_ITEMS_GRID - 1
          ? "right"
          : currentPosInGrid === 0
          ? "left"
          : lastDirection ?? "left"
      );
  }, WAIT_TO_TRIGGER_SWIPE);

  // Cause a rerender on init to set the initial state
  instantiateSwipeManager();
  rerender();
}

main();
