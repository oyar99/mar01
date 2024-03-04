// Author: Jhon
// Handles the grid logic for mobile devices
import 'hammerjs'
import { DIRECTION_LEFT, DIRECTION_RIGHT } from 'hammerjs';

const MAX_ITEMS_GRID = 9;
const isGridManagerEnabled = window.innerWidth <= 640;

function main() {
    let currentPosInGrid = 0;

    if (!isGridManagerEnabled) {
        return;
    }

    let manager: HammerManager;
    let swipe: SwipeRecognizer;

    const handleSwipeEvent = (e: HammerInput) => {
        switch(e.offsetDirection) {
            case DIRECTION_RIGHT:
              switch (true) {
                  case currentPosInGrid > 0:
                      currentPosInGrid--;
                      break;
              }
              break;
            case DIRECTION_LEFT:
              switch (true) {
                  case currentPosInGrid < MAX_ITEMS_GRID - 1:
                      currentPosInGrid++;
                      break;
              }
              break;
          }
          rerender();
    };

    const rerender = () => {
        const instantiateSwipeManager = (inst: number) => {
            // Destroy old listener
            swipe && manager?.remove(swipe);
            manager?.off('swipe');

            // Add new listener
            manager = new Hammer.Manager(document.getElementById(`gi-${inst + 1}`)?.parentNode!);
            swipe = new Hammer.Swipe();
            manager.add(swipe);
            manager.on('swipe', handleSwipeEvent);
        };

        for (let i = 0; i < MAX_ITEMS_GRID; i++) {
            const el = <HTMLElement>document.getElementById(`gi-${i + 1}`)?.parentNode!;
            switch(true) {
                case i === currentPosInGrid:
                    el?.classList.remove('hidden-mb');
                    instantiateSwipeManager(i);
                    break;
                default:
                    el?.classList.add('hidden-mb');
                    break;
            }
        }
    };

    // Cause a rerender on init to set the initial state
    rerender();
}

main();