import React, { FC, useCallback, useEffect, useRef } from 'react';
import './assets/styles/global.scss';

import s from './App.module.scss';
import { AnnotationTooltip } from './components/AnnotationTooltip';
import { TreableComponentApp } from './components/TreableComponentApp';

const App: FC = () => {
  const configuratorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get reference to the configurator element
    const configuratorElement = configuratorRef.current;
    if (!configuratorElement) return;

    let startY: number | null = null;

    // Handle touch start
    const handleTouchStart = (event: TouchEvent) => {
      if (!event.target || !configuratorElement.contains(event.target as Node))
        return;

      // Store the initial touch position
      if (event.touches.length === 1) {
        startY = event.touches[0].clientY;
      }
    };

    // Handle touch move - prevent rubber band effect
    const handleTouchMove = (event: TouchEvent) => {
      // Only handle touch events within our configurator
      if (!event.target || !configuratorElement.contains(event.target as Node))
        return;
      if (startY === null || event.touches.length !== 1) return;

      const touchedEl = document.elementFromPoint(
        event.touches[0].clientX,
        event.touches[0].clientY
      );
      if (!touchedEl) return;

      const currentY = event.touches[0].clientY;
      const deltaY = currentY - startY;

      let element: Element | null = touchedEl;
      let isScrollable = false;

      // Check if we're on a scrollable element that needs to scroll
      while (element && !isScrollable) {
        if (element.scrollHeight > element.clientHeight) {
          // Element can scroll vertically
          if (
            (element.scrollTop <= 0 && deltaY > 0) ||
            (element.scrollTop + element.clientHeight >= element.scrollHeight &&
              deltaY < 0)
          ) {
            // At the top and pulling down OR at the bottom and pulling up
            // We should prevent default
            isScrollable = false;
          } else {
            // Middle of scrollable content - allow natural scrolling
            isScrollable = true;
          }
          break;
        }
        element = element.parentElement;
      }

      // If not on a scrollable element or at edges of scrollable content
      if (!isScrollable) {
        event.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className="configurator" ref={configuratorRef}>
      <div
        className="content"
        style={{ position: 'relative', width: '100%', height: '100%' }}
      >
        <AnnotationTooltip />
        <TreableComponentApp />
      </div>
    </div>
  );
};

export default App;
