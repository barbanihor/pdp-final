class MainProduct {
  constructor(sectionId) {
    this.sectionId = sectionId;
    this.section = document.querySelector(`#main-product-${sectionId}`);

    if (!this.section) return;

    // Storage for prefetched product HTML
    this.productData = {};

    this.init();
  }

  init() {
    this.setupGallery();
    this.setupColorButtons();
    this.setupSizeButtons();
    this.setupForm();
    this.setupAccordionHandlers();
    this.setupStickyATC();
  }

  // Gallery thumbnail clicks
  setupGallery() {
    const thumbs = this.section.querySelectorAll('.product-gallery__thumb');
    const images = this.section.querySelectorAll('.product-gallery__media-item');

    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const index = thumb.getAttribute('data-media-index');

        // Remove active from all thumbs
        thumbs.forEach((t) => t.classList.remove('product-gallery__thumb--active'));
        thumb.classList.add('product-gallery__thumb--active');

        // Hide all images, show selected
        images.forEach((img) => {
          if (img.getAttribute('data-media-index') === index) {
            img.classList.remove('hidden');
          } else {
            img.classList.add('hidden');
          }
        });
      });
    });
  }

  // Fetch product HTML from server
  async fetchProduct(productHandle) {
    const url = `/products/${productHandle}?section_id=${this.sectionId}`;
    const response = await fetch(url);
    const html = await response.text();
    return html;
  }

  // Prefetch first 3 related products
  async prefetchProducts() {
    const colorButtons = this.section.querySelectorAll('.product-detail__color');
    const first3Buttons = Array.from(colorButtons).slice(0, 3);

    for (const button of first3Buttons) {
      const handle = button.getAttribute('data-product-handle');

      // Skip if already fetched
      if (this.productData[handle]) continue;

      try {
        const html = await this.fetchProduct(handle);
        this.productData[handle] = html;
        console.log(`Prefetched: ${handle}`);
      } catch (error) {
        console.log(`Failed to prefetch: ${handle}`);
      }
    }
  }

  // Switch to different product
  async switchProduct(productHandle) {
    try {
      let html;

      // Check if we have this product already
      if (this.productData[productHandle]) {
        console.log(`Using prefetched: ${productHandle}`);
        html = this.productData[productHandle];
      } else {
        console.log(`Fetching: ${productHandle}`);
        html = await this.fetchProduct(productHandle);
        this.productData[productHandle] = html;
      }

      // Parse HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newSection = doc.querySelector(`#main-product-${this.sectionId}`);

      if (!newSection) return;

      // Update specific parts of the page
      this.updateGallery(newSection);
      this.updateTitle(newSection);
      this.updateDescription(newSection);
      this.updateRating(newSection);
      this.updatePrice(newSection);
      this.updateAvailability(newSection);
      this.updateSizes(newSection);
      this.updateColorButtons(newSection);
      this.updateAccordion(newSection);

      // Update URL
      window.history.pushState({}, '', `/products/${productHandle}`);

      // Dispatch event for product recommendations
      const productChangeEvent = new CustomEvent('product:changed', {
        detail: { productHandle }
      });
      document.dispatchEvent(productChangeEvent);
    } catch (error) {
      console.error('Error switching product:', error);
    }
  }

  // Update gallery images
  updateGallery(newSection) {
    const currentGallery = this.section.querySelector('.product-gallery');
    const newGallery = newSection.querySelector('.product-gallery');

    if (currentGallery && newGallery) {
      currentGallery.innerHTML = newGallery.innerHTML;
      this.setupGallery(); // Re-attach click handlers
    }
  }

  // Update product title
  updateTitle(newSection) {
    const current = this.section.querySelector('.product-detail__title');
    const newTitle = newSection.querySelector('.product-detail__title');

    if (current && newTitle) {
      current.textContent = newTitle.textContent;
    }
  }

  // Update description
  updateDescription(newSection) {
    const current = this.section.querySelector('.product-detail__description');
    const newDesc = newSection.querySelector('.product-detail__description');

    if (current && newDesc) {
      current.innerHTML = newDesc.innerHTML;
    } else if (current && !newDesc) {
      current.remove();
    } else if (!current && newDesc) {
      const title = this.section.querySelector('.product-detail__title');
      if (title) {
        title.insertAdjacentHTML('afterend', newDesc.outerHTML);
      }
    }
  }

  // Update rating
  updateRating(newSection) {
    const current = this.section.querySelector('.product-detail__rating');
    const newRating = newSection.querySelector('.product-detail__rating');

    if (current && newRating) {
      current.innerHTML = newRating.innerHTML;
    }
  }

  // Update price
  updatePrice(newSection) {
    const current = this.section.querySelector(`#variant-price-${this.sectionId}`);
    const newPrice = newSection.querySelector(`#variant-price-${this.sectionId}`);

    if (current && newPrice) {
      current.innerHTML = newPrice.innerHTML;
    }
  }

  // Update availability
  updateAvailability(newSection) {
    const current = this.section.querySelector(`#variant-availability-${this.sectionId}`);
    const newAvail = newSection.querySelector(`#variant-availability-${this.sectionId}`);

    if (current && newAvail) {
      current.innerHTML = newAvail.innerHTML;
    }
  }

  // Update size buttons
  updateSizes(newSection) {
    const currentContainer = this.section.querySelector(
      `#size-options-${this.sectionId}`
    );
    const newContainer = newSection.querySelector(`#size-options-${this.sectionId}`);

    if (currentContainer && newContainer) {
      currentContainer.innerHTML = newContainer.innerHTML;
      this.setupSizeButtons(); // Re-attach click handlers
    }

    // Update hidden variant input
    const currentInput = this.section.querySelector(
      `#product-variant-id-${this.sectionId}`
    );
    const newInput = newSection.querySelector(`#product-variant-id-${this.sectionId}`);

    if (currentInput && newInput) {
      currentInput.value = newInput.value;
    }
  }

  // Update active state on color buttons
  updateColorButtons(newSection) {
    const currentButtons = this.section.querySelectorAll('.product-detail__color');
    const newButtons = newSection.querySelectorAll('.product-detail__color');

    currentButtons.forEach((btn, i) => {
      const newBtn = newButtons[i];
      if (newBtn && newBtn.classList.contains('product-detail__color--active')) {
        btn.classList.add('product-detail__color--active');
      } else {
        btn.classList.remove('product-detail__color--active');
      }
    });
  }

  // Update accordion
  updateAccordion(newSection) {
    const currentAccordion = this.section.querySelector('.product-accordion');
    const newAccordion = newSection.querySelector('.product-accordion');

    if (currentAccordion && newAccordion) {
      currentAccordion.innerHTML = newAccordion.innerHTML;
      this.setupAccordionHandlers();
    } else if (!currentAccordion && newAccordion) {
      // If accordion doesn't exist, insert it after tagline
      const tagline = this.section.querySelector('.product-detail__tagline');
      if (tagline) {
        tagline.insertAdjacentElement('afterend', newAccordion);
        this.setupAccordionHandlers();
      }
    } else if (currentAccordion && !newAccordion) {
      currentAccordion.remove();
    }
  }

  // Setup accordion click handlers
  setupAccordionHandlers() {
    const accordionItems = this.section.querySelectorAll('.product-accordion__item');

    accordionItems.forEach((item) => {
      const header = item.querySelector('.product-accordion__header');

      // Remove old listeners by cloning
      const newHeader = header.cloneNode(true);
      header.parentNode.replaceChild(newHeader, header);

      newHeader.addEventListener('click', function () {
        item.classList.toggle('is-open');
      });
    });
  }

  // Setup color button clicks
  setupColorButtons() {
    const buttons = this.section.querySelectorAll('.product-detail__color');

    buttons.forEach((button) => {
      button.addEventListener('click', async () => {
        // Skip if already active
        if (button.classList.contains('product-detail__color--active')) {
          return;
        }

        const handle = button.getAttribute('data-product-handle');
        await this.switchProduct(handle);
      });
    });

    // Prefetch first 3 products after page loads
    setTimeout(() => {
      this.prefetchProducts();
    }, 500);
  }

  // Setup size button clicks
  setupSizeButtons() {
    const buttons = this.section.querySelectorAll('.product-detail__size');
    const variantInput = this.section.querySelector(
      `#product-variant-id-${this.sectionId}`
    );

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        if (button.disabled) return;

        const variantId = button.getAttribute('data-variant-id');

        // Update active state
        buttons.forEach((btn) => btn.classList.remove('product-detail__size--active'));
        button.classList.add('product-detail__size--active');

        // Update hidden input
        if (variantInput) {
          variantInput.value = variantId;
        }

        // Sync sticky bar select
        const stickySelect = document.querySelector(
          `#sticky-size-select-${this.sectionId}`
        );
        if (stickySelect) {
          stickySelect.value = variantId;
        }

        // Update sticky price
        this.updateStickyPrice(variantId);
      });
    });
  }

  // Setup add to cart form
  setupForm() {
    const form = this.section.querySelector(`#main-product-form-${this.sectionId}`);
    const variantInput = this.section.querySelector(
      `#product-variant-id-${this.sectionId}`
    );

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: variantInput.value,
              quantity: 1,
            }),
          });

          if (response.ok) {
            window.location.href = '/cart';
          }
        } catch (error) {
          console.error('Error adding to cart:', error);
        }
      });
    }
  }

  // Setup Sticky Add to Cart
  setupStickyATC() {
    const stickyBar = document.querySelector(`#sticky-atc-${this.sectionId}`);
    const mainSubmitBtn = this.section.querySelector(`#submit-btn-${this.sectionId}`);

    if (!stickyBar || !mainSubmitBtn) return;

    // Intersection Observer to show/hide sticky bar
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Main button is visible, hide sticky bar
            stickyBar.classList.remove('is-visible');
          } else {
            // Main button is not visible, show sticky bar
            stickyBar.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '0px',
      }
    );

    observer.observe(mainSubmitBtn);

    // Setup sticky bar interactions
    this.setupStickyBarInteractions();
  }

  // Setup sticky bar size select and button
  setupStickyBarInteractions() {
    const stickyBar = document.querySelector(`#sticky-atc-${this.sectionId}`);
    const stickySelect = stickyBar.querySelector(`#sticky-size-select-${this.sectionId}`);
    const stickyButton = stickyBar.querySelector(`#sticky-submit-${this.sectionId}`);
    const mainVariantInput = this.section.querySelector(
      `#product-variant-id-${this.sectionId}`
    );

    // Sync sticky select with main form
    if (stickySelect) {
      stickySelect.addEventListener('change', (e) => {
        const variantId = e.target.value;
        mainVariantInput.value = variantId;

        // Update price in sticky bar
        this.updateStickyPrice(variantId);

        // Update size buttons in main form
        const sizeButtons = this.section.querySelectorAll('.product-detail__size');
        sizeButtons.forEach((btn) => {
          if (btn.getAttribute('data-variant-id') === variantId) {
            btn.click();
          }
        });
      });
    }

    // Sticky button click - submit main form
    if (stickyButton) {
      stickyButton.addEventListener('click', async () => {
        const variantId = stickySelect ? stickySelect.value : mainVariantInput.value;

        try {
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: variantId,
              quantity: 1,
            }),
          });

          if (response.ok) {
            window.location.href = '/cart';
          }
        } catch (error) {
          console.error('Error adding to cart:', error);
        }
      });
    }
  }

  // Update sticky bar price when variant changes
  async updateStickyPrice(variantId) {
    const stickyPriceContainer = document.querySelector(`#sticky-price-${this.sectionId}`);
    if (!stickyPriceContainer) return;

    // Find the variant data from the current product
    const sizeButtons = this.section.querySelectorAll('.product-detail__size');
    const selectedButton = Array.from(sizeButtons).find(
      (btn) => btn.getAttribute('data-variant-id') === variantId
    );

    if (selectedButton) {
      // Get price from main form
      const mainPriceContainer = this.section.querySelector(
        `#variant-price-${this.sectionId}`
      );
      if (mainPriceContainer) {
        stickyPriceContainer.innerHTML = mainPriceContainer.innerHTML;
      }
    }
  }
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  document.querySelectorAll('[id^="main-product-"]').forEach((section) => {
    const sectionId = section.id.replace('main-product-', '');
    new MainProduct(sectionId);
  });
}
