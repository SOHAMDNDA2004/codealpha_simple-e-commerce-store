const loginForm = document.getElementById('login-form');
const errorElement = document.getElementById('error');

// Redirect if already logged in
document.addEventListener('DOMContentLoaded', () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        window.location.href = 'index.html';
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://shopvibe-backend-scp1.onrender.com/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Invalid email or password');
        }

        // Store the JWT and user data securely in the browser
        localStorage.setItem('userInfo', JSON.stringify(data));
        
        // Smart redirect: If they have items in cart, send to checkout. Otherwise, home.
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length > 0) {
            window.location.href = 'checkout.html';
        } else {
            window.location.href = 'index.html';
        }
        
    } catch (error) {
        errorElement.textContent = error.message;
        errorElement.classList.remove('hidden');
    }
});