const checkoutForm = document.getElementById('checkout-form');
const errorElement = document.getElementById('error');

// Load cart and user data
const cart = JSON.parse(localStorage.getItem('cart')) || [];
const userInfo = JSON.parse(localStorage.getItem('userInfo'));

// Calculate totals
const totalPrice = cart.reduce((acc, item) => acc + item.qty * item.price, 0);
const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

const initCheckout = () => {
    if (!userInfo || !userInfo.token) {
        alert('You must be logged in to checkout.');
        window.location.href = 'login.html';
        return;
    }
    if (cart.length === 0) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('total-items').innerText = totalItems;
    document.getElementById('total-price').innerText = `$${totalPrice.toFixed(2)}`;
};

checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const shippingAddress = {
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        postalCode: document.getElementById('postalCode').value,
        country: document.getElementById('country').value,
    };

    const orderData = {
        orderItems: cart,
        shippingAddress,
        totalPrice
    };

    try {
        const response = await fetch('https://shopvibe-backend-scp1.onrender.com/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to place order');
        }

        // Clear cart on success
        localStorage.removeItem('cart');
        alert('Order placed successfully!');
        window.location.href = 'index.html';
        
    } catch (error) {
        errorElement.textContent = error.message;
        errorElement.classList.remove('hidden');
    }
});

document.addEventListener('DOMContentLoaded', initCheckout);