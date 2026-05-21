/* ==========================================================================
   CasinoSwipe Tinder-Style Swipe Physics Controller
   ========================================================================== */

class SwipeEngine {
  constructor(cardElement, callbacks = {}) {
    this.card = cardElement;
    this.callbacks = callbacks;
    
    // Physics & movement configuration
    this.thresholdX = 110; // px displacement before right/left swipe triggers
    this.thresholdY = 120; // px displacement up before super like triggers
    this.maxRotation = 15; // max degrees of rotation during extreme drag
    
    // Current gesture state tracker
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.isDragging = false;
    
    // Stamps overlays inside the card
    this.stampLike = this.card.querySelector('.card-stamp.like');
    this.stampNope = this.card.querySelector('.card-stamp.nope');
    this.stampSuper = this.card.querySelector('.card-stamp.super');
    
    this.initEvents();
  }
  
  initEvents() {
    // Bind modern Pointer Events which cover both mouse drag and touch drags
    this.card.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
    this.card.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    this.card.addEventListener('pointerup', (e) => this.handlePointerUp(e));
    this.card.addEventListener('pointercancel', (e) => this.handlePointerUp(e));
    
    // Prevent default scroll behavior when touching inside card
    this.card.addEventListener('touchstart', (e) => {
      // Only prevent if dragging from top (to allow inner card scrolling in details section)
      const isCardContent = e.target.closest('.card-content');
      if (!isCardContent || isCardContent.scrollTop === 0) {
        e.preventDefault();
      }
    }, { passive: false });
  }
  
  handlePointerDown(e) {
    // Do not initiate drag if user is clicking buttons or inside scrollable card body (if scrolled down)
    if (e.target.closest('.control-btn') || e.target.closest('.card-tab-btn') || e.target.closest('.accordion-header')) {
      return;
    }
    
    const cardContent = e.target.closest('.card-content');
    if (cardContent && cardContent.scrollTop > 5) {
      // Let standard scroll happen
      return;
    }
    
    this.isDragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    
    // Add dragging class to disable CSS animations during manual drag
    this.card.classList.add('dragging');
    this.card.setPointerCapture(e.pointerId);
  }
  
  handlePointerMove(e) {
    if (!this.isDragging) return;
    
    this.currentX = e.clientX - this.startX;
    this.currentY = e.clientY - this.startY;
    
    // Calculate drag percentage for dynamic stamp opacities
    const percentX = this.currentX / this.thresholdX;
    const percentY = this.currentY / this.thresholdY; // Negative is UP
    
    // Rotation logic (rotate positive when dragging right, negative when dragging left)
    // Pivot is from bottom, so top rotates more
    const rotation = (this.currentX / window.innerWidth) * this.maxRotation * 2;
    
    // Apply real-time transforms
    this.card.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0) rotate(${rotation}deg)`;
    
    // Trigger stamp overlays opacity adjustments
    this.updateStamps(percentX, percentY);
    
    if (this.callbacks.onDrag) {
      this.callbacks.onDrag(this.currentX, this.currentY);
    }
  }
  
  handlePointerUp(e) {
    if (!this.isDragging) return;
    this.isDragging = false;
    
    this.card.classList.remove('dragging');
    
    // Clean up Pointer capture
    try {
      this.card.releasePointerCapture(e.pointerId);
    } catch(err) {}
    
    // Check if swipe triggered or if we should spring-back
    const dispX = this.currentX;
    const dispY = this.currentY;
    
    this.currentX = 0;
    this.currentY = 0;
    
    // Swipe UP (Super Like) check first
    if (dispY < -this.thresholdY && Math.abs(dispX) < Math.abs(dispY)) {
      this.throwCard('up');
    }
    // Swipe RIGHT (Like) check
    else if (dispX > this.thresholdX) {
      this.throwCard('right');
    }
    // Swipe LEFT (Nope) check
    else if (dispX < -this.thresholdX) {
      this.throwCard('left');
    }
    // Spring Back to center (no threshold reached)
    else {
      this.springBack();
    }
  }
  
  updateStamps(percentX, percentY) {
    // Reset stamp opacities
    if (this.stampLike) this.stampLike.style.opacity = 0;
    if (this.stampNope) this.stampNope.style.opacity = 0;
    if (this.stampSuper) this.stampSuper.style.opacity = 0;
    
    // Dragging UP (Super Like)
    if (percentY < -0.3 && Math.abs(percentX) < Math.abs(percentY)) {
      if (this.stampSuper) {
        this.stampSuper.style.opacity = Math.min(Math.abs(percentY) * 1.5, 1);
      }
    }
    // Dragging RIGHT (Like)
    else if (percentX > 0.1) {
      if (this.stampLike) {
        this.stampLike.style.opacity = Math.min(percentX * 1.2, 1);
      }
    }
    // Dragging LEFT (Nope)
    else if (percentX < -0.1) {
      if (this.stampNope) {
        this.stampNope.style.opacity = Math.min(Math.abs(percentX) * 1.2, 1);
      }
    }
  }
  
  springBack() {
    this.card.style.transform = '';
    if (this.stampLike) this.stampLike.style.opacity = 0;
    if (this.stampNope) this.stampNope.style.opacity = 0;
    if (this.stampSuper) this.stampSuper.style.opacity = 0;
    
    if (this.callbacks.onCancel) {
      this.callbacks.onCancel();
    }
  }
  
  throwCard(direction) {
    let finalTransform = '';
    
    if (direction === 'right') {
      finalTransform = `translate3d(${window.innerWidth + 200}px, ${this.currentY}px, 0) rotate(35deg)`;
      if (this.stampLike) this.stampLike.style.opacity = 1;
    } else if (direction === 'left') {
      finalTransform = `translate3d(-${window.innerWidth + 200}px, ${this.currentY}px, 0) rotate(-35deg)`;
      if (this.stampNope) this.stampNope.style.opacity = 1;
    } else if (direction === 'up') {
      finalTransform = `translate3d(${this.currentX}px, -${window.innerHeight + 200}px, 0) scale(0.9)`;
      if (this.stampSuper) this.stampSuper.style.opacity = 1;
    }
    
    // Apply final out-of-screen transition
    this.card.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.45s';
    this.card.style.transform = finalTransform;
    this.card.style.opacity = 0;
    
    // Trigger callbacks after throwing animation finishes
    setTimeout(() => {
      if (direction === 'right' && this.callbacks.onSwipeRight) {
        this.callbacks.onSwipeRight();
      } else if (direction === 'left' && this.callbacks.onSwipeLeft) {
        this.callbacks.onSwipeLeft();
      } else if (direction === 'up' && this.callbacks.onSwipeUp) {
        this.callbacks.onSwipeUp();
      }
    }, 350);
  }
  
  // Programmatic swipe triggers (e.g. clicking Nope or Like buttons)
  buttonSwipe(direction) {
    if (this.isDragging) return;
    
    this.card.classList.remove('dragging');
    
    if (direction === 'right') {
      this.throwCard('right');
    } else if (direction === 'left') {
      this.throwCard('left');
    } else if (direction === 'up') {
      this.throwCard('up');
    }
  }
}
