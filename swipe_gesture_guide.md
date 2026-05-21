# Swipe Gesture Integration Technical Specification Guide

This guide describes how to implement Tinder-style card-swiping physics inside standard modern front-end architectures (Framer Motion, React Spring, Hammer.js, or Pure JavaScript).

---

## 1. Swipe Physics & Mathematics

To make swipes feel natural, spring-loaded, and responsive, the element transform needs to track displacement vectors relative to the gesture origin:

- **Gesture Coordinates**: Track delta coordinates `deltaX` and `deltaY` from pointer down origin.
- **Dynamic Pivot Rotation**: Rotation is scaled relative to screen displacement so that dragging right tilts the card clockwise, and dragging left tilts it counterclockwise.
- **Formula**:
  $$\theta = \left(\frac{\Delta x}{W_{\text{viewport}}}\right) \times \theta_{\text{max}}$$
  Where $\theta_{\text{max}}$ is typically set between $12^{\circ}$ to $18^{\circ}$.
- **Overlays Stamp Opacities**:
  - `LIKE` Stamp opacity: $\min(\max(0, \Delta x / X_{\text{threshold}}), 1.0)$
  - `NOPE` Stamp opacity: $\min(\max(0, -\Delta x / X_{\text{threshold}}), 1.0)$
  - `SUPER LIKE` Stamp opacity: $\min(\max(0, -\Delta y / Y_{\text{threshold}}), 1.0)$ (only when $|\Delta x| < |\Delta y|$)

---

## 2. React + Framer Motion Implementation

For a React-based application, Framer Motion provides the easiest and highest performance physics-based gesture control.

```jsx
import React from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';

export const CasinoSwipeCard = ({ casino, onSwipeLeft, onSwipeRight, onSwipeUp }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform drag distance directly to rotation angles
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  
  // Dynamic opacity transforms for visual stamp indicators
  const opacityLike = useTransform(x, [0, 120], [0, 1]);
  const opacityNope = useTransform(x, [-120, 0], [1, 0]);
  const opacitySuper = useTransform(y, [-120, 0], [1, 0]);

  const controls = useAnimation();

  const handleDragEnd = async (event, info) => {
    const thresholdX = 120;
    const thresholdY = 120;

    // Check thresholds to trigger swipe out
    if (info.offset.x > thresholdX) {
      // Swipe Right
      await controls.start({ x: 500, rotate: 30, opacity: 0, transition: { duration: 0.3 } });
      onSwipeRight(casino);
    } else if (info.offset.x < -thresholdX) {
      // Swipe Left
      await controls.start({ x: -500, rotate: -30, opacity: 0, transition: { duration: 0.3 } });
      onSwipeLeft(casino);
    } else if (info.offset.y < -thresholdY && Math.abs(info.offset.x) < Math.abs(info.offset.y)) {
      // Swipe Up (Super Like)
      await controls.start({ y: -800, scale: 0.8, opacity: 0, transition: { duration: 0.3 } });
      onSwipeUp(casino);
    } else {
      // Reset Spring Back
      controls.start({ x: 0, y: 0, rotate: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      style={{ x, y, rotate }}
      animate={controls}
      onDragEnd={handleDragEnd}
      className="swipe-card"
    >
      {/* Card UI elements */}
      <motion.div style={{ opacity: opacityLike }} className="stamp like">LIKE</motion.div>
      <motion.div style={{ opacity: opacityNope }} className="stamp nope">NOPE</motion.div>
      <motion.div style={{ opacity: opacitySuper }} className="stamp super">SUPER LIKE</motion.div>
      
      {/* Card Content ... */}
    </motion.div>
  );
};
```

---

## 3. Keyboard Accessibility Alternatives

To comply with **WCAG AA Guidelines**, keyboard navigation must be enabled for players using screen readers or assistive tools:

| Key pressed | Action | Function mapping |
|---|---|---|
| `Arrow Left` or `A` | Swipe LEFT (NOPE) | `triggerSwipe('left')` |
| `Arrow Right` or `D` | Swipe RIGHT (LIKE) | `triggerSwipe('right')` |
| `Arrow Up` or `W` | Swipe UP (SUPER LIKE) | `triggerSwipe('up')` |
| `Space` or `H` | Toggle Expand / Details | `triggerAccordion()` |
| `Escape` | Close Details Panel / Drawer | `toggleFilterDrawer(false)` |
