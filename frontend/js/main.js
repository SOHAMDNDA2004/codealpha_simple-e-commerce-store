const API_URL = 'https://shopvibe-backend-scp1.onrender.com/api/products';
const productList = document.getElementById('product-list');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');

// Fetch products from the backend
const fetchProducts = async () => {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const products = await response.json();
        loadingElement.classList.add('hidden');
        renderProducts(products);
    } catch (error) {
        loadingElement.classList.add('hidden');
        errorElement.textContent = `Error loading products: ${error.message}`;
        errorElement.classList.remove('hidden');
    }
};

// Generate HTML for each product
const renderProducts = (products) => {
    productList.innerHTML = products.map(product => `
        <div class="card">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/300x300?text=Product'">
            <h3>${product.name}</h3>
            <p>${product.description.substring(0, 60)}...</p>
            <span class="price">$${product.price.toFixed(2)}</span>
            <button class="btn" onclick="viewProduct('${product._id}')">View Details</button>
        </div>
    `).join('');
};

// Route to single product page via URL parameter
const viewProduct = (productId) => {
    window.location.href = `product.html?id=${productId}`;
};

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', fetchProducts);