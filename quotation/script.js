document.addEventListener('DOMContentLoaded', function () {
    const VAT_RATE = 0.07;
    const BUNDLE_QUANTITY = 12; 
    const BUNDLE_DISCOUNT_PERCENTAGE = 0.10; 
    const products = [
        { id: 1, name: "Wireless Mouse", price: 25.00 },
        { id: 2, name: "Mechanical Keyboard", price: 80.00 },
        { id: 3, name: "USB-C Hub", price: 45.50 },
        { id: 4, name: "4K Webcam", price: 120.00 },
        { id: 5, name: "Noise-Cancelling Headphones", price: 199.99 },
        { id: 6, name: "Laptop Stand", price: 35.00 },
        { id: 7, name: "External SSD (1TB)", price: 95.75 }
    ];

    const addProductForm = document.getElementById('add-product-form');
    const productSelect = document.getElementById('product-select');
    const quantityInput = document.getElementById('product-quantity');
    const tableBody = document.getElementById('quotation-table-body');
    const grossTotalEl = document.getElementById('gross-total');
    const vatAmountEl = document.getElementById('vat-amount');
    const finalTotalEl = document.getElementById('final-total');
    const emptyMessage = document.getElementById('empty-quotation-message');
    const addProductModal = new bootstrap.Modal(document.getElementById('addProductModal'));

    function populateProductOptions() {
        productSelect.innerHTML = '<option value="" disabled selected>Choose a product...</option>';
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name} - $${product.price.toFixed(2)}`;
            productSelect.appendChild(option);
        });
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    function updateTotals() {
        const rows = tableBody.querySelectorAll('tr');
        let grossTotal = 0;

        rows.forEach(row => {
            const totalCell = row.querySelector('td:nth-child(4)');
            grossTotal += parseFloat(totalCell.dataset.value);
        });

        const vatAmount = grossTotal * VAT_RATE;
        const finalTotal = grossTotal + vatAmount;

        grossTotalEl.textContent = formatCurrency(grossTotal);
        vatAmountEl.textContent = formatCurrency(vatAmount);
        finalTotalEl.textContent = formatCurrency(finalTotal);

        emptyMessage.style.display = rows.length === 0 ? 'block' : 'none';
    }

    function handleAddProduct(event) {
        event.preventDefault();

        const selectedProductId = productSelect.value;
        const quantity = parseInt(quantityInput.value, 10);

        if (!selectedProductId || !quantity) {
            alert('Please select a product and specify a quantity.');
            return;
        }

        const product = products.find(p => p.id == selectedProductId);
        let totalPrice = product.price * quantity;
        let discountText = '';

        if (quantity >= BUNDLE_QUANTITY) {
            const discountAmount = totalPrice * BUNDLE_DISCOUNT_PERCENTAGE;
            totalPrice -= discountAmount; 
          
            discountText = `<br><small class="text-success"><strong>(Bundle Discount: ${ (BUNDLE_DISCOUNT_PERCENTAGE * 100).toFixed(0) }%)</strong></small>`;
        }

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td class="p-3">${product.name}</td>
            <td class="p-3">${formatCurrency(product.price)}</td>
            <td class="p-3">${quantity}</td>
            <td class="p-3" data-value="${totalPrice.toFixed(2)}">${formatCurrency(totalPrice)}${discountText}</td>
            <td class="p-3 text-center">
                <i class="bi bi-trash-fill text-danger delete-btn" title="Delete item"></i>
            </td>
        `;

        newRow.querySelector('.delete-btn').addEventListener('click', () => {
            newRow.remove();
            updateTotals();
        });

        tableBody.appendChild(newRow);
        updateTotals();

        addProductForm.reset();
        productSelect.value = "";
        addProductModal.hide();
    }

    // Initial setup
    populateProductOptions();
    updateTotals();
    addProductForm.addEventListener('submit', handleAddProduct);
});