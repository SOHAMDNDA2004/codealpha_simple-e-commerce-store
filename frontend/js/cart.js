const cartItemsContainer = document.getElementById('cart-items');
const summaryQty = document.getElementById('summary-qty');
const summaryPrice = document.getElementById('summary-price');
const cartCountNav = document.getElementById('cart-count');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const renderCart = () => {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<div class="status-msg">Your cart is empty. <a href="index.html" style="color: #17a2b8;">Go back to shopping</a></div>`;
        updateSummary();
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/80?text=No+Img'">
            <div class="cart-item-details">
                <a href="product.html?id=${item.product}"><strong>${item.name}</strong></a>
                <p>$${item.price.toFixed(2)}</p>
            </div>
            <select class="qty-select" onchange="updateQty('${item.product}', this.value)">
                ${[...Array(item.countInStock).keys()].map(x => 
                    `<option value="${x + 1}" ${item.qty === x + 1 ? 'selected' : ''}>${x + 1}</option>`
                ).join('')}
            </select>
            <button class="btn remove-btn" onclick="removeFromCart('${item.product}')">Remove</button>
        </div>
    `).join('');

    updateSummary();
};

const updateQty = (id, newQty) => {
    const item = cart.find(x => x.product === id);
    if (item) {
        item.qty = Number(newQty);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateSummary();
    }
};

const removeFromCart = (id) => {
    cart = cart.filter(x => x.product !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
};

const updateSummary = () => {
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cart.reduce((acc, item) => acc + item.qty * item.price, 0);

    summaryQty.innerText = totalItems;
    summaryPrice.innerText = `$${totalPrice.toFixed(2)}`;
    cartCountNav.innerText = totalItems;
};

const proceedToCheckout = () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    window.location.href = 'checkout.html';
};

// Initialize
document.addEventListener('DOMContentLoaded', renderCart);