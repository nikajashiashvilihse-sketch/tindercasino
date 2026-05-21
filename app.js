/* ==========================================================================
   CasinoSwipe Core Application State & UI Orchestrator
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  new CasinoSwipeApp();
});

class CasinoSwipeApp {
  constructor() {
    // Current Application State
    this.userState = {
      ageVerified: false,
      onboardingComplete: false,
      country: "Germany", // Default auto-detected country
      preferences: {
        minBonusSize: 0,
        maxMinDeposit: 100,
        games: [],
        payments: [],
        license: "any",
        noKycOnly: false,
        rgToolsOnly: false,
        withdrawalSpeed: "any"
      },
      matches: [],
      historyStack: [], // For swipe UNDO feature
      compareSelections: [] // Track up to 2 items for side-by-side
    };

    // Filter state (starts identical to onboarding choices)
    this.activeFilters = JSON.parse(JSON.stringify(this.userState.preferences));
    this.activeFilters.country = this.userState.country;
    
    this.boostActive = false; // Is "Boost" active (casinos with highest bonuses first)
    this.currentDeckQueue = []; // Currently filtered active deck
    this.renderedCardInstances = []; // Active SwipeEngine instances
    this.activeTab = "discover"; // Navigation tab state

    // Initialize HTML DOM nodes
    this.cacheDomElements();
    this.bindEvents();
    
    // Attempt Geo IP Auto-Detection Simulation
    this.simulateGeoDetection();
    
    // Check if onboarding is needed
    this.checkOnboardingState();
    
    // Set up Dev Spec code blocks inside Dev Portal
    this.initDeveloperSpecs();
  }

  cacheDomElements() {
    this.appContainer = document.querySelector(".app-container");
    this.onboardingOverlay = document.getElementById("onboarding-overlay");
    this.onboardingSteps = document.querySelectorAll(".onboarding-step");
    this.stepDots = document.querySelectorAll(".indicator-dot");
    
    // Navigation panels
    this.panels = {
      discover: document.getElementById("panel-discover"),
      matches: document.getElementById("panel-matches"),
      search: document.getElementById("panel-search"),
      profile: document.getElementById("panel-profile")
    };
    
    this.tabItems = document.querySelectorAll(".tab-item");
    this.cardStack = document.getElementById("card-stack");
    this.emptyDeckState = document.getElementById("empty-deck");
    
    // Swiping action buttons
    this.btnUndo = document.getElementById("btn-undo");
    this.btnNope = document.getElementById("btn-nope");
    this.btnSuper = document.getElementById("btn-super");
    this.btnLike = document.getElementById("btn-like");
    this.btnBoost = document.getElementById("btn-boost");
    
    // Drawer components
    this.drawerBackdrop = document.getElementById("drawer-backdrop");
    this.filterDrawer = document.getElementById("filter-drawer");
    
    // Overlays
    this.compareOverlay = document.getElementById("compare-overlay");
    this.devPortalOverlay = document.getElementById("dev-portal-overlay");
    this.matchCelebration = document.getElementById("match-celebration");
    
    // Canvas Confetti
    this.confettiCanvas = document.getElementById("celebration-canvas");
    this.ctx = this.confettiCanvas?.getContext("2d");
  }

  bindEvents() {
    // 1. Navigation Tab Switching
    this.tabItems.forEach(tab => {
      tab.addEventListener("click", (e) => {
        const targetView = tab.getAttribute("data-tab");
        this.switchTab(targetView);
      });
    });

    // 2. Onboarding wizard steps next buttons
    document.querySelectorAll(".btn-next-step").forEach(btn => {
      btn.addEventListener("click", () => {
        const nextStep = parseInt(btn.getAttribute("data-next"));
        this.goToOnboardingStep(nextStep);
      });
    });

    // 3. Onboarding selections
    // Game options toggles
    document.querySelectorAll(".onboarding-step .preference-grid .selectable-box").forEach(box => {
      box.addEventListener("click", () => {
        box.classList.toggle("selected");
        const type = box.getAttribute("data-type");
        const val = box.getAttribute("data-val");
        
        if (type === "game") {
          const arr = this.userState.preferences.games;
          const idx = arr.indexOf(val);
          if (idx > -1) arr.splice(idx, 1);
          else arr.push(val);
        } else if (type === "payment") {
          const arr = this.userState.preferences.payments;
          const idx = arr.indexOf(val);
          if (idx > -1) arr.splice(idx, 1);
          else arr.push(val);
        }
      });
    });

    // 4. Age Verification gates
    const btnAgeVerify = document.getElementById("btn-age-verify");
    if (btnAgeVerify) {
      btnAgeVerify.addEventListener("click", () => {
        this.userState.ageVerified = true;
        this.goToOnboardingStep(2);
      });
    }

    const btnAgeReject = document.getElementById("btn-age-reject");
    if (btnAgeReject) {
      btnAgeReject.addEventListener("click", () => {
        alert("Compliance Gate: You must be over 18 to explore online gaming platforms. Access Denied.");
      });
    }

    // 5. Completion of onboarding
    const btnOnboardingComplete = document.getElementById("btn-onboarding-complete");
    if (btnOnboardingComplete) {
      btnOnboardingComplete.addEventListener("click", () => {
        // Collect slider & select values
        const minBonus = document.getElementById("ob-slider-bonus");
        const maxDep = document.getElementById("ob-slider-deposit");
        const licensePref = document.getElementById("ob-select-license");
        const kycToggle = document.getElementById("ob-toggle-kyc");
        const rgToggle = document.getElementById("ob-toggle-rg");
        
        if (minBonus) this.userState.preferences.minBonusSize = parseInt(minBonus.value);
        if (maxDep) this.userState.preferences.maxMinDeposit = parseInt(maxDep.value);
        if (licensePref) this.userState.preferences.license = licensePref.value;
        if (kycToggle) this.userState.preferences.noKycOnly = kycToggle.checked;
        if (rgToggle) this.userState.preferences.rgToolsOnly = rgToggle.checked;
        
        // Sync active filters
        this.activeFilters = JSON.parse(JSON.stringify(this.userState.preferences));
        this.activeFilters.country = this.userState.country;
        
        this.userState.onboardingComplete = true;
        this.onboardingOverlay.style.display = "none";
        
        // Load initial deck
        this.loadDeck();
      });
    }

    // 6. Action Button Listeners (Discover Feed Controls)
    this.btnNope.addEventListener("click", () => this.triggerSwipe("left"));
    this.btnLike.addEventListener("click", () => this.triggerSwipe("right"));
    this.btnSuper.addEventListener("click", () => this.triggerSwipe("up"));
    this.btnUndo.addEventListener("click", () => this.undoLastSwipe());
    
    // Boost! Feature Trigger
    this.btnBoost.addEventListener("click", () => {
      this.boostActive = !this.boostActive;
      this.btnBoost.classList.toggle("active", this.boostActive);
      
      // Flash notifications or animations inside container
      const flash = document.createElement("div");
      flash.className = "compare-sticky-bar";
      flash.style.bottom = "120px";
      flash.style.borderColor = "var(--color-violet)";
      flash.innerHTML = `<span style="color:#c084fc"><i class="fas fa-bolt"></i> Boost ${this.boostActive ? 'Activated' : 'Deactivated'}! High Welcome Bonuses Listed First!</span>`;
      this.appContainer.appendChild(flash);
      setTimeout(() => flash.remove(), 2000);

      this.loadDeck();
    });

    // 7. Filter Drawer triggers
    document.getElementById("btn-open-filter")?.addEventListener("click", () => this.toggleFilterDrawer(true));
    document.getElementById("btn-close-filter")?.addEventListener("click", () => this.toggleFilterDrawer(false));
    this.drawerBackdrop.addEventListener("click", () => this.toggleFilterDrawer(false));

    // Dynamic Filter Drawer value inputs binding
    const drawerSliders = {
      bonus: document.getElementById("filter-slider-bonus"),
      deposit: document.getElementById("filter-slider-deposit")
    };

    drawerSliders.bonus?.addEventListener("input", (e) => {
      document.getElementById("val-filter-bonus").innerText = `€${e.target.value}+`;
    });
    drawerSliders.deposit?.addEventListener("input", (e) => {
      document.getElementById("val-filter-deposit").innerText = `€${e.target.value}`;
    });

    // Apply Filter Button in drawer
    document.getElementById("btn-apply-filters")?.addEventListener("click", () => {
      // Collect updated filters from drawer fields
      this.activeFilters.minBonusSize = parseInt(document.getElementById("filter-slider-bonus").value);
      this.activeFilters.maxMinDeposit = parseInt(document.getElementById("filter-slider-deposit").value);
      this.activeFilters.license = document.getElementById("filter-select-license").value;
      this.activeFilters.withdrawalSpeed = document.getElementById("filter-select-speed").value;
      
      this.activeFilters.noKycOnly = document.getElementById("filter-toggle-kyc").checked;
      this.activeFilters.rgToolsOnly = document.getElementById("filter-toggle-rg").checked;
      
      // Update Game multi-select inside drawer
      const gameCheckboxes = [];
      document.querySelectorAll(".drawer-body .preference-grid .selectable-box").forEach(box => {
        if (box.classList.contains("selected")) {
          gameCheckboxes.push(box.getAttribute("data-val"));
        }
      });
      this.activeFilters.games = gameCheckboxes;

      this.toggleFilterDrawer(false);
      this.loadDeck();
    });

    // Reset Filters Button in drawer
    document.getElementById("btn-reset-filters")?.addEventListener("click", () => {
      // Clear selections
      document.getElementById("filter-slider-bonus").value = 0;
      document.getElementById("val-filter-bonus").innerText = "€0+";
      
      document.getElementById("filter-slider-deposit").value = 100;
      document.getElementById("val-filter-deposit").innerText = "€100";
      
      document.getElementById("filter-select-license").value = "any";
      document.getElementById("filter-select-speed").value = "any";
      
      document.getElementById("filter-toggle-kyc").checked = false;
      document.getElementById("filter-toggle-rg").checked = false;
      
      document.querySelectorAll(".drawer-body .preference-grid .selectable-box").forEach(box => {
        box.classList.remove("selected");
      });

      this.activeFilters = JSON.parse(JSON.stringify(this.userState.preferences));
      this.activeFilters.country = this.userState.country;
      
      this.toggleFilterDrawer(false);
      this.loadDeck();
    });

    // 8. Dynamic manual country selectors in Profile
    const profileCountrySelect = document.getElementById("profile-country-select");
    profileCountrySelect?.addEventListener("change", (e) => {
      this.userState.country = e.target.value;
      this.activeFilters.country = e.target.value;
      
      // Flash reload alert
      alert(`Geo-market switched to: ${e.target.value}. Deck refreshing...`);
      this.loadDeck();
    });

    // 9. Dynamic self-exclusion options
    const selfExcludeToggle = document.getElementById("self-exclusion-toggle");
    selfExcludeToggle?.addEventListener("change", (e) => {
      if (e.target.checked) {
        const confirmExclusion = confirm("WARNING: Enabling self-exclusion will lock your access to all discovery swipes and matches for a cool-down period. Are you sure you want to trigger this responsible gambling safety control?");
        if (confirmExclusion) {
          this.triggerSelfExclusion();
        } else {
          e.target.checked = false;
        }
      }
    });

    // 10. Open Dev Specifications Portal
    document.getElementById("btn-open-dev")?.addEventListener("click", () => {
      this.devPortalOverlay.classList.add("active");
    });
    document.getElementById("btn-close-dev")?.addEventListener("click", () => {
      this.devPortalOverlay.classList.remove("active");
    });

    // Dev specs tabs
    document.querySelectorAll(".dev-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".dev-tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".dev-pane").forEach(p => p.style.display = "none");
        
        btn.classList.add("active");
        const paneId = btn.getAttribute("data-pane");
        const targetPane = document.getElementById(paneId);
        if (targetPane) targetPane.style.display = "block";
      });
    });

    // 11. Search page text filter
    const searchInput = document.getElementById("search-input");
    searchInput?.addEventListener("input", (e) => {
      this.renderSearchResults(e.target.value);
    });

    // 12. Compare overlay close
    document.getElementById("btn-close-compare")?.addEventListener("click", () => {
      this.compareOverlay.classList.remove("active");
    });
  }

  simulateGeoDetection() {
    // Standard mock geo API integration simulation
    console.log("Locating player: Fetching geolocation data...");
    // Pre-filling geolocation state based on country selector
    const currentHour = new Date().getHours();
    console.log(`Geo Status: Player detected in ${this.userState.country}. Timezone verified. standard regulatory guidelines applied.`);
  }

  checkOnboardingState() {
    // If age is not verified, keep onboarding view active
    if (!this.userState.onboardingComplete) {
      this.onboardingOverlay.style.display = "flex";
      this.goToOnboardingStep(1);
    }
  }

  goToOnboardingStep(step) {
    this.onboardingSteps.forEach(s => s.classList.remove("active"));
    this.stepDots.forEach(d => d.classList.remove("active"));

    const currentStepDiv = document.getElementById(`step-${step}`);
    if (currentStepDiv) {
      currentStepDiv.classList.add("active");
    }
    const currentDot = document.getElementById(`dot-${step}`);
    if (currentDot) {
      currentDot.classList.add("active");
    }
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    
    // Update Tab Highlights
    this.tabItems.forEach(item => {
      if (item.getAttribute("data-tab") === tabName) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Hide all panel pages
    Object.values(this.panels).forEach(panel => {
      panel.classList.remove("active");
    });

    // Activate selected panel
    if (this.panels[tabName]) {
      this.panels[tabName].classList.add("active");
    }

    // Trigger tab-specific loaders
    if (tabName === "matches") {
      this.renderMatches();
    } else if (tabName === "search") {
      this.renderSearchResults("");
    }
  }

  /* ==========================================================================
     Deck Management & Loading Algorithms
     ========================================================================== */
  loadDeck() {
    // 1. Clear stack DOM
    this.cardStack.innerHTML = "";
    this.renderedCardInstances = [];

    // 2. Fetch filtered database
    this.currentDeckQueue = getMatchingCasinos(this.activeFilters, 'rating', this.boostActive);

    // 3. Update Undo stack button
    this.btnUndo.disabled = this.userState.historyStack.length === 0;
    this.btnUndo.style.opacity = this.userState.historyStack.length === 0 ? "0.3" : "1";

    // 4. Render top 3 layered cards
    if (this.currentDeckQueue.length === 0) {
      this.emptyDeckState.style.display = "flex";
      this.btnNope.disabled = true;
      this.btnLike.disabled = true;
      this.btnSuper.disabled = true;
    } else {
      this.emptyDeckState.style.display = "none";
      this.btnNope.disabled = false;
      this.btnLike.disabled = false;
      this.btnSuper.disabled = false;

      // Render max 3 cards for tinder stacked depth
      const renderCount = Math.min(this.currentDeckQueue.length, 3);
      for (let i = 0; i < renderCount; i++) {
        this.renderCardNode(this.currentDeckQueue[i], i);
      }
    }
  }

  renderCardNode(casino, index) {
    const cardDiv = document.createElement("div");
    cardDiv.className = `swipe-card card-${index}`;
    cardDiv.setAttribute("data-id", casino.id);
    
    // Inject Custom Casino SVGs & templates
    cardDiv.innerHTML = `
      <!-- Hero Header -->
      <div class="card-hero" style="background-image: ${casino.bgColor}">
        ${casino.bgPattern}
        <div class="hero-top">
          <div class="brand-logo-mockup">${casino.logo}</div>
          <div class="live-indicator">
            <div class="live-dot"></div>
            <span>${casino.livePlayers} active</span>
          </div>
        </div>
        <div class="hero-bottom">
          <h2 class="casino-name">${casino.name}</h2>
          <p class="casino-tagline">“${casino.tagline}”</p>
        </div>
      </div>

      <!-- Scrollable Card Body -->
      <div class="card-content">
        <!-- Quick Stats Bar -->
        <div class="stats-bar">
          <div class="stat-item">
            <span class="stat-label">⭐ RATING</span>
            <span class="stat-val gold">${casino.rating} / 5</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">💰 BONUS</span>
            <span class="stat-val">${casino.welcomeBonus.split(" up to ")[0]}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">💳 MIN DEP</span>
            <span class="stat-val">€${casino.minDeposit}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">🚀 PAYOUT</span>
            <span class="stat-val">${casino.withdrawalSpeed}</span>
          </div>
        </div>

        <!-- Geo Status & License Line -->
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem;">
          <div>Licence: <span class="badge badge-gold" style="padding: 2px 6px;">${casino.license}</span></div>
          <div class="geo-status-indicator" style="color: var(--color-green); font-weight:700;">
            ✅ Available in ${this.userState.country}
          </div>
        </div>

        <!-- About Me Section -->
        <div>
          <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px;">
            ${casino.vibeTags.map(tag => `<span class="badge badge-violet">${tag}</span>`).join('')}
          </div>
          <p style="font-size: 0.8rem; color: var(--text-secondary); line-height:1.4;">
            ${casino.bio}
          </p>
        </div>

        <!-- Inner Bonus Breakdown Tabs -->
        <div>
          <div class="card-tabs-header">
            <button class="card-tab-btn active" data-tab-name="welcome-${casino.id}">Welcome</button>
            <button class="card-tab-btn" data-tab-name="spins-${casino.id}">Free Spins</button>
            <button class="card-tab-btn" data-tab-name="weekly-${casino.id}">Reloads</button>
            <button class="card-tab-btn" data-tab-name="vip-${casino.id}">VIP</button>
          </div>
          <div class="card-tab-content">
            <div id="welcome-${casino.id}" class="tab-pane active">
              <span class="subcard-title">${casino.bonusBreakdown.welcome.amount}</span>
              <p style="font-size:0.75rem; color:var(--text-secondary);">${casino.bonusBreakdown.welcome.details}</p>
              <div class="subcard-meta">
                <span>Wagering: <strong>${casino.bonusBreakdown.welcome.wagering}</strong></span>
                <span>Expiry: <strong>${casino.bonusBreakdown.welcome.expiry}</strong></span>
              </div>
            </div>
            <div id="spins-${casino.id}" class="tab-pane">
              <span class="subcard-title">${casino.bonusBreakdown.freeSpins.count}</span>
              <p style="font-size:0.75rem; color:var(--text-secondary);">Valid on: <strong>${casino.bonusBreakdown.freeSpins.slot}</strong> (${casino.bonusBreakdown.freeSpins.value})</p>
              <div class="subcard-meta">
                <span>Wagering: <strong>${casino.bonusBreakdown.freeSpins.wagering}</strong></span>
                <span>Expiry: <strong>${casino.bonusBreakdown.freeSpins.expiry}</strong></span>
              </div>
            </div>
            <div id="weekly-${casino.id}" class="tab-pane">
              <span class="subcard-title">${casino.bonusBreakdown.weekly.title}</span>
              <p style="font-size:0.75rem; color:var(--text-secondary);">${casino.bonusBreakdown.weekly.description}</p>
            </div>
            <div id="vip-${casino.id}" class="tab-pane">
              <span class="subcard-title">${casino.bonusBreakdown.vip.title}</span>
              <p style="font-size:0.75rem; color:var(--text-secondary);">${casino.bonusBreakdown.vip.description}</p>
            </div>
          </div>
        </div>

        <!-- Payment Icons Row -->
        <div>
          <span class="form-label" style="font-size:0.7rem;">Supported Payments (Fastest: ${casino.fastestPayment})</span>
          <div class="payment-grid" style="margin-top:6px;">
            ${casino.payments.map(p => {
              const isFastest = casino.fastestPayment.toLowerCase().includes(p);
              return `<span class="payment-badge ${isFastest ? 'fastest' : ''}">
                <i class="fas ${this.getPaymentIcon(p)}"></i> ${p.toUpperCase()}
              </span>`;
            }).join('')}
          </div>
        </div>

        <!-- Deal Breakers Accordion (Fine Print) -->
        <div>
          <div class="accordion-header" id="acc-header-${casino.id}">
            <span>🔎 Fine Print & Responsible Gambling</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="accordion-body" id="acc-body-${casino.id}">
            <div style="display:flex; flex-direction:column; gap:8px;">
              <div style="display:flex; justify-content:space-between;">
                <span>Wagering Rate:</span>
                <span class="badge ${casino.wageringRating === 'low' ? 'badge-green' : casino.wageringRating === 'medium' ? 'badge-gold' : 'badge-red'}">
                  ${casino.wageringRating.toUpperCase()}
                </span>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span>Weekly cashout limit:</span>
                <strong>€${casino.withdrawalLimitWeekly.toLocaleString()} / week</strong>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span>Restricted Locations:</span>
                <span style="font-size:0.75rem; color:var(--color-red);">${casino.restrictedCountries.join(', ')}</span>
              </div>
              <div style="border-top:1px solid rgba(255,255,255,0.05); padding-top:6px; margin-top:4px;">
                <span style="font-size:0.7rem; text-transform:uppercase; font-weight:700; color:var(--color-gold); display:block; margin-bottom:4px;">🛡 Responsible Gambling Tools</span>
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                  ${casino.rgTools.depositLimits ? '<span class="badge badge-green">Deposit Limits</span>' : ''}
                  ${casino.rgTools.selfExclusion ? '<span class="badge badge-green">Self Exclusion</span>' : ''}
                  ${casino.rgTools.coolOff ? '<span class="badge badge-green">Cool-off Limits</span>' : ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Standard regulatory RG tools warnings -->
        <div style="font-size:0.65rem; color:var(--text-tertiary); text-align:center; border-top:1px solid rgba(255,255,255,0.05); padding-top:10px;">
          🔞 Be Gamble Aware. Set limitations before starting. 18+ Only.
        </div>
      </div>

      <!-- Draggable Stamps -->
      <div class="card-stamp like">LIKE</div>
      <div class="card-stamp nope">NOPE</div>
      <div class="card-stamp super">SUPER LIKE</div>
    `;

    // Append to stack
    this.cardStack.appendChild(cardDiv);

    // Bind inner card click mechanisms (tabs, accordions)
    this.bindInnerCardInteractiveControls(cardDiv, casino.id);

    // Instantiate Swipe Gesture Physics Engine on this card
    if (index === 0) {
      const swiper = new SwipeEngine(cardDiv, {
        onSwipeLeft: () => this.handleSwipeResult("left", casino),
        onSwipeRight: () => this.handleSwipeResult("right", casino),
        onSwipeUp: () => this.handleSwipeResult("up", casino)
      });
      this.renderedCardInstances.push(swiper);
    }
  }

  bindInnerCardInteractiveControls(cardNode, casinoId) {
    // 1. Tabs inside card
    const tabBtns = cardNode.querySelectorAll(".card-tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("pointerdown", (e) => {
        e.stopPropagation(); // Avoid triggering swipe gestures on tab clicks
      });
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        tabBtns.forEach(b => b.classList.remove("active"));
        cardNode.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
        
        btn.classList.add("active");
        const targetPaneId = btn.getAttribute("data-tab-name");
        cardNode.querySelector(`#${targetPaneId}`).classList.add("active");
      });
    });

    // 2. Accordions inside card
    const accHeader = cardNode.querySelector(`#acc-header-${casinoId}`);
    const accBody = cardNode.querySelector(`#acc-body-${casinoId}`);
    if (accHeader && accBody) {
      accHeader.addEventListener("pointerdown", (e) => e.stopPropagation());
      accHeader.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        accHeader.classList.toggle("active");
        accBody.classList.toggle("active");
        
        const arrow = accHeader.querySelector("i");
        arrow.classList.toggle("fa-chevron-down");
        arrow.classList.toggle("fa-chevron-up");
        
        // Auto scroll card body to focus accordion
        const content = cardNode.querySelector(".card-content");
        setTimeout(() => {
          content.scrollTo({
            top: content.scrollHeight,
            behavior: "smooth"
          });
        }, 100);
      });
    }
  }

  getPaymentIcon(slug) {
    const icons = {
      visa: "fa-cc-visa",
      mastercard: "fa-cc-mastercard",
      paypal: "fa-cc-paypal",
      skrill: "fa-wallet",
      neteller: "fa-money-bill-wave",
      paysafecard: "fa-shield-alt",
      bitcoin: "fa-btc",
      eth: "fa-coins",
      usdt: "fa-dollar-sign"
    };
    return icons[slug] || "fa-credit-card";
  }

  /* ==========================================================================
     Swiping Logic & Actions
     ========================================================================== */
  triggerSwipe(direction) {
    if (this.renderedCardInstances.length > 0) {
      const topSwiper = this.renderedCardInstances[0];
      topSwiper.buttonSwipe(direction);
    }
  }

  handleSwipeResult(direction, casino) {
    console.log(`Swipe Event: User swiped ${direction.toUpperCase()} on ${casino.name}`);
    
    // Save to undo stack history before editing state
    this.userState.historyStack.push({
      direction: direction,
      casino: casino
    });

    // Process actions
    if (direction === "right") {
      this.addMatch(casino);
    } else if (direction === "up") {
      this.addMatch(casino);
      this.triggerSuperLikeCelebration(casino);
    }

    // Progress deck
    this.loadDeck();
  }

  undoLastSwipe() {
    if (this.userState.historyStack.length === 0) return;
    
    const lastAction = this.userState.historyStack.pop();
    console.log(`Undo Event: Restoring card ${lastAction.casino.name} that was swiped ${lastAction.direction.toUpperCase()}`);
    
    // Remove from matches if it was saved
    if (lastAction.direction === "right" || lastAction.direction === "up") {
      this.userState.matches = this.userState.matches.filter(m => m.id !== lastAction.casino.id);
    }

    // Force reload
    this.loadDeck();
  }

  addMatch(casino) {
    // Deduplicate
    if (!this.userState.matches.some(m => m.id === casino.id)) {
      this.userState.matches.push(casino);
      console.log(`Match Saved: ${casino.name} added to your Match Deck!`);
    }
  }

  triggerSuperLikeCelebration(casino) {
    // Show match celebration overlay
    const matchedLogoDiv = document.getElementById("matched-casino-logo");
    if (matchedLogoDiv) {
      matchedLogoDiv.innerHTML = casino.logo;
    }
    
    this.matchCelebration.classList.add("active");

    // Launch Confetti Explosion
    this.launchJackpotConfetti();

    // Claim affiliate CPA click tracking logic simulator
    const btnPlay = document.getElementById("btn-celebration-play");
    if (btnPlay) {
      btnPlay.onclick = () => {
        this.trackAffiliateClick(casino);
        window.open(casino.affiliateLink, "_blank");
        this.matchCelebration.classList.remove("active");
      };
    }

    document.getElementById("btn-celebration-keep")?.addEventListener("click", () => {
      this.matchCelebration.classList.remove("active");
    });
  }

  trackAffiliateClick(casino) {
    // Premium custom click tracking log hooks simulator
    const trackingPayload = {
      clickId: `cpa_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      casinoId: casino.id,
      casinoName: casino.name,
      payoutSpeed: casino.withdrawalSpeed,
      geoMarket: this.userState.country,
      monetization: "Affiliate CPA RevShare Match"
    };
    
    console.log("💰 Affiliate CLICK TRACKING Log Triggered Successfully:", trackingPayload);
    
    // Display interactive log block on UI
    const trackerLog = document.createElement("div");
    trackerLog.className = "compare-sticky-bar";
    trackerLog.style.bottom = "120px";
    trackerLog.style.borderColor = "var(--color-green)";
    trackerLog.innerHTML = `<span style="color:var(--color-green)"><i class="fas fa-check-circle"></i> Affiliate Click Logged! ID: ${trackingPayload.clickId} (CPA match ready)</span>`;
    this.appContainer.appendChild(trackerLog);
    setTimeout(() => trackerLog.remove(), 2500);
  }

  /* ==========================================================================
     Matches List & Side-By-Side Comparison Grid
     ========================================================================== */
  renderMatches() {
    const listContainer = document.getElementById("matches-list");
    if (!listContainer) return;

    listContainer.innerHTML = "";
    
    if (this.userState.matches.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-deck" style="height:250px;">
          <i class="fas fa-heart-broken"></i>
          <h3>No Matches Yet</h3>
          <p>Swipe Right on casinos to match with them and start comparisons!</p>
          <button class="btn-primary" onclick="document.querySelector('.tab-item[data-tab=discover]').click()">Start Swiping</button>
        </div>
      `;
      this.updateCompareBarState();
      return;
    }

    this.userState.matches.forEach(casino => {
      const isChecked = this.userState.compareSelections.some(c => c.id === casino.id);
      
      const itemDiv = document.createElement("div");
      itemDiv.className = "match-item";
      itemDiv.innerHTML = `
        <div class="match-delete" data-id="${casino.id}"><i class="fas fa-times"></i></div>
        <div class="match-hero" style="background-image: ${casino.bgColor}">
          ${casino.bgPattern}
          <div class="match-logo">${casino.logo}</div>
        </div>
        <div class="match-info">
          <span class="match-name">${casino.name}</span>
          <span class="match-bonus">${casino.welcomeBonus}</span>
          
          <div class="match-actions">
            <a href="${casino.affiliateLink}" target="_blank" class="btn-match-play" data-id="${casino.id}">Claim Bonus</a>
            <div class="btn-match-compare ${isChecked ? 'checked' : ''}" data-id="${casino.id}">
              <i class="fas ${isChecked ? 'fa-check' : 'fa-balance-scale'}"></i>
            </div>
          </div>
        </div>
      `;

      // Bind delete action
      itemDiv.querySelector(".match-delete").addEventListener("click", (e) => {
        e.stopPropagation();
        this.userState.matches = this.userState.matches.filter(m => m.id !== casino.id);
        this.userState.compareSelections = this.userState.compareSelections.filter(c => c.id !== casino.id);
        this.renderMatches();
      });

      // Bind play click tracking
      itemDiv.querySelector(".btn-match-play").addEventListener("click", (e) => {
        this.trackAffiliateClick(casino);
      });

      // Bind compare toggle action
      itemDiv.querySelector(".btn-match-compare").addEventListener("click", (e) => {
        this.toggleCompareSelection(casino, itemDiv.querySelector(".btn-match-compare"));
      });

      listContainer.appendChild(itemDiv);
    });

    this.updateCompareBarState();
  }

  toggleCompareSelection(casino, checkboxBtn) {
    const idx = this.userState.compareSelections.findIndex(c => c.id === casino.id);
    
    if (idx > -1) {
      // Remove
      this.userState.compareSelections.splice(idx, 1);
      checkboxBtn.classList.remove("checked");
      checkboxBtn.querySelector("i").className = "fas fa-balance-scale";
    } else {
      // Add if under 2 limit
      if (this.userState.compareSelections.length >= 2) {
        alert("Compare limits reached: You can compare maximum 2 casinos side-by-side.");
        return;
      }
      this.userState.compareSelections.push(casino);
      checkboxBtn.classList.add("checked");
      checkboxBtn.querySelector("i").className = "fas fa-check";
    }

    this.updateCompareBarState();
  }

  updateCompareBarState() {
    // Render sticky bottom compare launcher bar
    const oldBar = document.getElementById("compare-bar");
    if (oldBar) oldBar.remove();

    if (this.userState.compareSelections.length === 0) return;

    const bar = document.createElement("div");
    bar.id = "compare-bar";
    bar.className = "compare-sticky-bar";
    
    if (this.userState.compareSelections.length === 1) {
      bar.innerHTML = `
        <span class="compare-text">✨ Select 1 more casino to compare side-by-side!</span>
        <button class="btn-compare-launch" style="background:#5d637c; color:#fff;" disabled>Compare (1/2)</button>
      `;
    } else {
      bar.innerHTML = `
        <span class="compare-text" style="color:var(--color-gold); font-weight:700;"><i class="fas fa-balance-scale"></i> Match-up Compare is Ready!</span>
        <button class="btn-compare-launch" id="btn-launch-compare-screen">Compare (2/2)</button>
      `;
    }

    this.panels.matches.appendChild(bar);

    document.getElementById("btn-launch-compare-screen")?.addEventListener("click", () => {
      this.launchCompareMode();
    });
  }

  launchCompareMode() {
    const [c1, c2] = this.userState.compareSelections;
    if (!c1 || !c2) return;

    // Render Side-by-Side Comparison matrix rows
    const c1BonusVal = parseInt(c1.welcomeBonus.match(/\d+/) || 0);
    const c2BonusVal = parseInt(c2.welcomeBonus.match(/\d+/) || 0);
    
    const detailsContainer = document.getElementById("compare-details-table");
    detailsContainer.innerHTML = `
      <!-- Brand Card Row -->
      <div class="compare-row">
        <div class="compare-row-title">Casino Profile</div>
        <div class="compare-columns">
          <div class="compare-col">
            <div class="compare-logo" style="background:${c1.bgColor}; border-radius:8px; padding:6px;">${c1.logo}</div>
            <span style="font-weight:800; font-size:1.1rem;">${c1.name}</span>
          </div>
          <div class="compare-col">
            <div class="compare-logo" style="background:${c2.bgColor}; border-radius:8px; padding:6px;">${c2.logo}</div>
            <span style="font-weight:800; font-size:1.1rem;">${c2.name}</span>
          </div>
        </div>
      </div>

      <!-- Rating Row -->
      <div class="compare-row">
        <div class="compare-row-title">Rating</div>
        <div class="compare-columns">
          <div class="compare-col">
            <span class="compare-cell ${c1.rating >= c2.rating ? 'better' : ''}">⭐ ${c1.rating} / 5</span>
          </div>
          <div class="compare-col">
            <span class="compare-cell ${c2.rating >= c1.rating ? 'better' : ''}">⭐ ${c2.rating} / 5</span>
          </div>
        </div>
      </div>

      <!-- Welcome Bonus Value Matchup -->
      <div class="compare-row">
        <div class="compare-row-title">Welcome Bonus Match</div>
        <div class="compare-columns">
          <div class="compare-col">
            <span class="compare-cell ${c1BonusVal >= c2BonusVal ? 'better' : ''}">${c1.welcomeBonus}</span>
          </div>
          <div class="compare-col">
            <span class="compare-cell ${c2BonusVal >= c1BonusVal ? 'better' : ''}">${c2.welcomeBonus}</span>
          </div>
        </div>
      </div>

      <!-- Min Deposit Match -->
      <div class="compare-row">
        <div class="compare-row-title">Min Buy-in (Deposit)</div>
        <div class="compare-columns">
          <div class="compare-col">
            <span class="compare-cell ${c1.minDeposit <= c2.minDeposit ? 'better' : ''}">€${c1.minDeposit}</span>
          </div>
          <div class="compare-col">
            <span class="compare-cell ${c2.minDeposit <= c1.minDeposit ? 'better' : ''}">€${c2.minDeposit}</span>
          </div>
        </div>
      </div>

      <!-- Withdrawal Speeds -->
      <div class="compare-row">
        <div class="compare-row-title">Withdrawal Speed</div>
        <div class="compare-columns">
          <div class="compare-col">
            <span class="compare-cell better">${c1.withdrawalSpeed}</span>
          </div>
          <div class="compare-col">
            <span class="compare-cell better">${c2.withdrawalSpeed}</span>
          </div>
        </div>
      </div>

      <!-- Wagering deal breakers -->
      <div class="compare-row">
        <div class="compare-row-title">Wagering Requirements</div>
        <div class="compare-columns">
          <div class="compare-col">
            <span class="compare-cell" style="color:${c1.wageringRating === 'low' ? 'var(--color-green)' : 'var(--color-gold)'}">
              ${c1.bonusBreakdown.welcome.wagering} (${c1.wageringRating.toUpperCase()})
            </span>
          </div>
          <div class="compare-col">
            <span class="compare-cell" style="color:${c2.wageringRating === 'low' ? 'var(--color-green)' : 'var(--color-gold)'}">
              ${c2.bonusBreakdown.welcome.wagering} (${c2.wageringRating.toUpperCase()})
            </span>
          </div>
        </div>
      </div>

      <!-- Licences -->
      <div class="compare-row">
        <div class="compare-row-title">Licenses & Safety</div>
        <div class="compare-columns">
          <div class="compare-col">
            <span class="badge badge-gold">${c1.license}</span>
          </div>
          <div class="compare-col">
            <span class="badge badge-gold">${c2.license}</span>
          </div>
        </div>
      </div>
    `;

    this.compareOverlay.classList.add("active");
  }

  /* ==========================================================================
     Advanced Search Panel
     ========================================================================== */
  renderSearchResults(query = "") {
    const listNode = document.getElementById("search-results-list");
    if (!listNode) return;

    listNode.innerHTML = "";

    const results = CASINO_DATABASE.filter(c => {
      const matchQuery = c.name.toLowerCase().includes(query.toLowerCase()) || 
                          c.bio.toLowerCase().includes(query.toLowerCase());
      return matchQuery;
    });

    if (results.length === 0) {
      listNode.innerHTML = `
        <div class="empty-deck" style="height:200px;">
          <i class="fas fa-search-minus"></i>
          <h3 style="font-size:1.1rem;">No casinos match your search query</h3>
        </div>
      `;
      return;
    }

    results.forEach(casino => {
      const item = document.createElement("div");
      item.className = "search-item";
      item.innerHTML = `
        <div class="search-item-logo" style="background:${casino.bgColor}">
          ${casino.logo}
        </div>
        <div class="search-item-details">
          <div class="search-item-name">${casino.name}</div>
          <div class="search-item-bonus">${casino.welcomeBonus}</div>
          <div class="search-item-meta">
            <span>⭐ ${casino.rating}</span>
            <span>💳 Min: €${casino.minDeposit}</span>
            <span>🚀 ${casino.withdrawalSpeed}</span>
          </div>
        </div>
        <button class="btn-primary" style="padding: 6px 12px; font-size:0.75rem;" id="btn-quick-view-${casino.id}">Swipe view</button>
      `;

      // Quick Swiping deck navigation hook
      item.querySelector(`#btn-quick-view-${casino.id}`).addEventListener("click", () => {
        // Rearrange activeFilters or sorting so this matches top of stack
        this.activeFilters = JSON.parse(JSON.stringify(this.userState.preferences));
        this.activeFilters.country = this.userState.country;
        
        // Push selected casino to the start of filtered list
        const completeList = getMatchingCasinos(this.activeFilters, 'rating', this.boostActive);
        const filteredList = completeList.filter(c => c.id !== casino.id);
        filteredList.unshift(casino);
        
        this.currentDeckQueue = filteredList;
        this.switchTab("discover");
        
        // Force loading deck based on custom list arrangement
        this.cardStack.innerHTML = "";
        this.renderedCardInstances = [];
        this.emptyDeckState.style.display = "none";
        this.btnNope.disabled = false;
        this.btnLike.disabled = false;
        this.btnSuper.disabled = false;
        
        const renderCount = Math.min(this.currentDeckQueue.length, 3);
        for (let i = 0; i < renderCount; i++) {
          this.renderCardNode(this.currentDeckQueue[i], i);
        }
      });

      listNode.appendChild(item);
    });
  }

  /* ==========================================================================
     Self-Exclusion / Responsible Gambling Locks
     ========================================================================== */
  triggerSelfExclusion() {
    this.appContainer.innerHTML = `
      <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:var(--space-xl); background:var(--bg-primary);">
        <i class="fas fa-user-shield" style="font-size:4rem; color:var(--color-coral); margin-bottom:var(--space-md); filter:drop-shadow(0 0 10px rgba(255, 71, 87, 0.4));"></i>
        <h2 style="font-family:var(--font-display); font-weight:900; margin-bottom:var(--space-xs); font-size:1.6rem;">SELF-EXCLUSION ACTIVATED</h2>
        <div style="background:var(--bg-secondary); border:1px solid var(--glass-border); padding:var(--space-md); border-radius:12px; margin-bottom:var(--space-lg); font-size:0.85rem; color:var(--text-secondary); text-align:left;">
          <p style="margin-bottom:8px;"><strong>Status:</strong> Active & Non-reversible</p>
          <p style="margin-bottom:8px;"><strong>Duration:</strong> 24 Hour Cool-off Match</p>
          <p>For your safety, we have completely locked all casino discovering matching, swipes, affiliate links, and profiles on this device. Take a deep breath and stay safe!</p>
        </div>
        <div style="font-size:0.75rem; color:var(--text-tertiary); margin-bottom:var(--space-lg);">
          🔞 If gambling is affecting your personal life, call BeGambleAware helpline immediately.
        </div>
        <button class="btn-secondary" onclick="window.location.reload();">Reload Portal Status</button>
      </div>
    `;
  }

  toggleFilterDrawer(isOpen) {
    if (isOpen) {
      // Sync drawer visual values with state
      document.getElementById("filter-slider-bonus").value = this.activeFilters.minBonusSize;
      document.getElementById("val-filter-bonus").innerText = `€${this.activeFilters.minBonusSize}+`;
      
      document.getElementById("filter-slider-deposit").value = this.activeFilters.maxMinDeposit;
      document.getElementById("val-filter-deposit").innerText = `€${this.activeFilters.maxMinDeposit}`;
      
      document.getElementById("filter-select-license").value = this.activeFilters.license;
      document.getElementById("filter-select-speed").value = this.activeFilters.withdrawalSpeed;
      
      document.getElementById("filter-toggle-kyc").checked = this.activeFilters.noKycOnly;
      document.getElementById("filter-toggle-rg").checked = this.activeFilters.rgToolsOnly;
      
      // Update Game list boxes
      document.querySelectorAll(".drawer-body .preference-grid .selectable-box").forEach(box => {
        const val = box.getAttribute("data-val");
        if (this.activeFilters.games.includes(val)) {
          box.classList.add("selected");
        } else {
          box.classList.remove("selected");
        }
      });

      this.drawerBackdrop.classList.add("active");
      this.filterDrawer.classList.add("active");
    } else {
      this.drawerBackdrop.classList.remove("active");
      this.filterDrawer.classList.remove("active");
    }
  }

  /* ==========================================================================
     Canvas Jackpot Confetti Engine
     ========================================================================== */
  launchJackpotConfetti() {
    if (!this.confettiCanvas || !this.ctx) return;
    
    // Fit canvas dimensions to application mockup size
    this.confettiCanvas.width = this.appContainer.clientWidth;
    this.confettiCanvas.height = this.appContainer.clientHeight;
    
    const particles = [];
    const colors = ["#ffd700", "#ff4757", "#00c48c", "#8a2be2", "#38bdf8"];
    
    // Create random particles
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: this.confettiCanvas.width / 2,
        y: this.confettiCanvas.height / 2 + 100, // explode upwards
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 12,
        speedY: (Math.random() - 0.8) * 16,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    const animateConfetti = () => {
      if (!this.matchCelebration.classList.contains("active")) return;

      this.ctx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
      
      let activeParticles = 0;
      
      particles.forEach(p => {
        if (p.opacity <= 0) return;
        activeParticles++;

        // Physics updates
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.35; // gravity pull
        p.speedX *= 0.98; // wind drag
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.008; // fade out slowly

        this.ctx.save();
        this.ctx.globalAlpha = p.opacity;
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;
        
        // Draw little squares and stars
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        
        this.ctx.restore();
      });

      if (activeParticles > 0) {
        requestAnimationFrame(animateConfetti);
      }
    };

    requestAnimationFrame(animateConfetti);
  }

  /* ==========================================================================
     Developer Specifications Portal Loader
     ========================================================================== */
  initDeveloperSpecs() {
    // 1. DESIGN TOKENS TAB SPEC
    const jsonTokens = {
      theme: "Casino Noir & Neon Glow",
      palettes: {
        darkBackground: "#090a0f",
        cardSecondary: "#121420",
        neonGold: "#ffd700",
        hotCoral: "#ff4757",
        electricGreen: "#00c48c",
        electricViolet: "#8a2be2"
      },
      typography: {
        display: "'Outfit', sans-serif (Bold, high impact headings)",
        body: "'Inter', sans-serif (Highly readable fine prints)"
      },
      motion: {
        fast: "0.15s cubic-bezier(0.4, 0, 0.2, 1)",
        spring: "0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
      }
    };
    document.getElementById("code-design-tokens").innerText = JSON.stringify(jsonTokens, null, 2);

    // 2. SWIPE MATHS TAB SPEC
    const mathGuide = `// Draggable Physics Translation Math Formula used:
const currentX = cursorX - startX;
const currentY = cursorY - startY;

// Dynamic Card Rotation Math based on screen width:
const rotation = (currentX / window.innerWidth) * maxRotationLimit * 2;
// Transforms elements live:
card.style.transform = \`translate3d(\${currentX}px, \${currentY}px, 0) rotate(\${rotation}deg)\`;

// Swipe stamp overlays threshold check formula:
const percentX = currentX / thresholdX;
stampLike.style.opacity = Math.min(percentX, 1.0); // opacity locks to 1.0
`;
    document.getElementById("code-swipe-guide").innerText = mathGuide;

    // 3. CASINO JSON DATA MODEL
    const casinoSchema = {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "title": "CasinoProfile",
      "type": "object",
      "required": ["id", "name", "license", "welcomeBonus", "minDeposit", "withdrawalSpeed", "rgTools"],
      "properties": {
        "id": { "type": "string" },
        "name": { "type": "string" },
        "welcomeBonus": { "type": "string", "description": "Display promo text" },
        "minDeposit": { "type": "integer" },
        "license": { "type": "string", "enum": ["MGA", "UKGC", "Curaçao", "Kahnawake"] },
        "kycRequirement": { "type": "string", "enum": ["no-kyc", "standard"] },
        "rgTools": {
          "type": "object",
          "properties": {
            "depositLimits": { "type": "boolean" },
            "selfExclusion": { "type": "boolean" }
          }
        }
      }
    };
    document.getElementById("code-data-model").innerText = JSON.stringify(casinoSchema, null, 2);

    // 4. CPA INTEGRATION HOOKS
    const affHooks = `// Hook placed on user Super Like or matched registration flows
function triggerAffiliateMatchout(casino) {
  const cpaPayload = {
    click_id: generateUniqueClickId(),
    tracker_slug: "casinoswipe_mobile_right",
    casino_target: casino.id,
    player_geo: detectUserGeoMarket(),
    timestamp: new Date().toISOString()
  };

  // 1. Post click payload details to marketing analytics
  fetch("https://api.casinoswipe.com/v1/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cpaPayload)
  });

  // 2. Open deep-linked CPA affiliate registration portal with redirect
  const redirectUrl = \`\${casino.affiliateLink}&click_id=\${cpaPayload.click_id}\`;
  window.open(redirectUrl, '_blank');
}
`;
    document.getElementById("code-affiliate-hooks").innerText = affHooks;
  }
}
