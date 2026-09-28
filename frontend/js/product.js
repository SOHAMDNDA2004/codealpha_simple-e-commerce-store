const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

const API_URL = `https://shopvibe-backend-scp1.onrender.com/api/products/${productId}`;
const productDetailsContainer = document.getElementById('product-details');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');

let currentProduct = {}; // Store the fetched product

const fetchProductDetails = async () => {
    if (!productId) {
        showError('No product ID provided in the URL.');
        return;
    }

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Product not found');
        
        currentProduct = await response.json();
        loadingElement.classList.add('hidden');
        renderProduct(currentProduct);
    } catch (error) {
        showError(`Error: ${error.message}`);
    }
};

const showError = (message) => {
    loadingElement.classList.add('hidden');
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
};

const renderProduct = (product) => {
    const inStock = product.countInStock > 0;
    const stockClass = inStock ? 'in-stock' : 'out-of-stock';
    const disabledBtn = inStock ? '' : 'disabled style="opacity: 0.5; cursor: not-allowed;"';

    productDetailsContainer.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400?text=Image+Not+Found'">
        </div>
        <div class="product-info">
            <h2>${product.name}</h2>
            <p><strong>Brand:</strong> ${product.brand} | <strong>Category:</strong> ${product.category}</p>
            <hr>
            <span class="price">$${product.price.toFixed(2)}</span>
            <span class="stock-badge ${stockClass}">${inStock ? 'In Stock' : 'Out of Stock'}</span>
            <p>${product.description}</p>
            <button class="btn" onclick="addToCart()" ${disabledBtn}>Add to Cart</button>
        </div>
    `;
    productDetailsContainer.classList.remove('hidden');
};

// Cart Logic
const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existItem = cart.find(x => x.product === currentProduct._id);

    if (existItem) {
        existItem.qty += 1;
    } else {
        cart.push({
            product: currentProduct._id,
            name: currentProduct.name,
            image: currentProduct.image,
            price: currentProduct.price,
            countInStock: currentProduct.countInStock,
            qty: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Item added to cart!');
};

const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
    document.getElementById('cart-count').innerText = totalItems;
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchProductDetails();
    updateCartCount();
});