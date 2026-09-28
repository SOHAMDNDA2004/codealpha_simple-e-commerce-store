const registerForm = document.getElementById('register-form');
const errorElement = document.getElementById('error');

// Redirect if the user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        window.location.href = 'index.html';
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Client-side password validation
    if (password !== confirmPassword) {
        errorElement.textContent = 'Passwords do not match';
        errorElement.classList.remove('hidden');
        return;
    }

    try {
        const response = await fetch('https://shopvibe-backend-scp1.onrender.com/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        // Store JWT and user data securely in the browser
        localStorage.setItem('userInfo', JSON.stringify(data));
        
        // Smart redirect to keep the user in their buying flow
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