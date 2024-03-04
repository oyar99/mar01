// Author: Jhon
// Handles the grid logic for mobile devices
import "hammerjs";
import { DIRECTION_LEFT, DIRECTION_RIGHT } from "hammerjs";

const MAX_ITEMS_GRID = 9;
const isGridManagerEnabled = window.innerWidth <= 640;

type SwipeDirection = "left" | "right";

function main() {
  let currentPosInGrid = 0;
  let lastDirection: SwipeDirection | undefined;

  if (!isGridManagerEnabled) {
    return;
  }

  let manager: HammerManager;
  let swipe: SwipeRecognizer;

  const handleSwipeEvent = (e: HammerInput) => {
    switch (e.offsetDirection) {
      case DIRECTION_RIGHT:
        switch (true) {
          case currentPosInGrid > 0:
            currentPosInGrid--;
            break;
        }
        lastDirection = "right";
        break;
      case DIRECTION_LEFT:
        switch (true) {
          case currentPosInGrid < MAX_ITEMS_GRID - 1:
            currentPosInGrid++;
            break;
        }
        lastDirection = "left";
        break;
    }
    rerender();
  };

  const rerender = () => {
    const instantiateSwipeManager = (inst: number) => {
      // Destroy old listener
      swipe && manager?.remove(swipe);
      manager?.off("swipe");

      // Add new listener
      manager = new Hammer.Manager(
        document.getElementById(`gi-${inst + 1}`)?.parentNode!
      );
      swipe = new Hammer.Swipe();
      manager.add(swipe);
      manager.on("swipe", handleSwipeEvent);
    };

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

    prev?.classList.add("slideOut-mb");
    setTimeout(() => {
        el?.classList.remove("hidden-mb");
        prev?.classList.remove("slideOut-mb");
        prev?.classList.add("hidden-mb");
    }, 1000);

    instantiateSwipeManager(currentPosInGrid);
  };

  // Cause a rerender on init to set the initial state
  rerender();
}

main();
