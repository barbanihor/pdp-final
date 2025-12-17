class Cart {
  constructor() {
    this.init();
  }

  init() {
    this.setupQuantityButtons();
    this.setupRemoveButtons();
  }

  setupQuantityButtons() {
    const qtyButtons = document.querySelectorAll('.cart__qty-btn');

    qtyButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        const action = button.dataset.action;
        const line = button.dataset.line;
        const input = document.querySelector(`.cart__qty-input[data-line="${line}"]`);

        let quantity = parseInt(input.value);

        if (action === 'increase') {
          quantity += 1;
        } else if (action === 'decrease' && quantity > 1) {
          quantity -= 1;
        }

        await this.updateQuantity(line, quantity);
      });
    });
  }

  setupRemoveButtons() {
    const removeButtons = document.querySelectorAll('.cart__item-remove');

    removeButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const line = button.dataset.line;
        await this.updateQuantity(line, 0);
      });
    });
  }

  async updateQuantity(line, quantity) {
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          line: line,
          quantity: quantity
        })
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  }
}

// Initialize cart
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new Cart());
} else {
  new Cart();
}
