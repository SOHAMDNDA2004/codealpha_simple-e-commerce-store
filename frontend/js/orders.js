const ordersContainer = document.getElementById('orders-container');
const ordersList = document.getElementById('orders-list');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');

document.addEventListener('DOMContentLoaded', async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // Redirect to login if not authenticated
    if (!userInfo || !userInfo.token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // Fetch orders using the live Render backend URL
        const response = await fetch('https://shopvibe-backend-scp1.onrender.com/api/orders/myorders', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }

        const orders = await response.json();
        loadingElement.classList.add('hidden');

        if (orders.length === 0) {
            ordersContainer.innerHTML = '<p style="text-align: center;">You have no past orders.</p>';
            ordersContainer.classList.remove('hidden');
            return;
        }

        // Render table rows
        ordersList.innerHTML = orders.map(order => `
            <tr>
                <td class="order-id">#${order._id.substring(0, 8)}</td>
                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                <td style="font-weight: 600;">$${order.totalPrice.toFixed(2)}</td>
                <td>
                    <span class="stock-badge ${order.isPaid ? 'in-stock' : 'out-of-stock'}">
                        ${order.isPaid ? 'Paid' : 'Processing'}
                    </span>
                </td>
            </tr>
        `).join('');

        ordersContainer.classList.remove('hidden');

    } catch (error) {
        loadingElement.classList.add('hidden');
        errorElement.textContent = error.message;
        errorElement.classList.remove('hidden');
    }
});