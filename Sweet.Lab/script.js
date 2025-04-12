// Плавна прокрутка для всіх посилань
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Бургер-меню
const burger = document.getElementById('burger');
const navMenu = document.querySelector('.nav-menu');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Кошик
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.querySelector('.checkout-btn');
const orderFormModal = document.getElementById('order-form-modal');
const closeOrderForm = document.querySelector('.close-order-form');
const orderForm = document.getElementById('order-form');
const orderItemsSummary = document.getElementById('order-items-summary');

let cart = [];

// Відкриття/закриття кошика
cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'flex';
});

closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Відкриття/закриття форми замовлення
checkoutBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
    orderFormModal.style.display = 'flex';
    updateOrderSummary();
});

closeOrderForm.addEventListener('click', () => {
    orderFormModal.style.display = 'none';
});

// Закриття модалок при кліку поза ними
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
    if (e.target === orderFormModal) {
        orderFormModal.style.display = 'none';
    }
});

// Дані товарів
const products = [
    { id: 1, name: 'Макарон "Волошка"', price: 50, category: 'all', image: 'makaron1.png' },
    { id: 2, name: 'Капкейк', price: 25, category: 'all', image: 'kapkay1.png' },
    { id: 3, name: 'Капкейк без цукру', price: 27, category: 'sugar-free', image: 'kapkay1.png' },
    { id: 4, name: 'Набір "Солодке щастя"', price: 125, category: 'sets', image: 'set1.jpeg' },
    { id: 5, name: 'Макарон "Волошка" без лактози', price: 55, category: 'lactose-free', image: 'makaron1.png' },
    { id: 6, name: 'Макарон "Волошка" без цукру', price: 150, category: 'sugar-free', image: 'makaron1.png' },
];

// Відображення товарів
const productGrid = document.getElementById('product-grid');
const categoryBtns = document.querySelectorAll('.category-btn');

function displayProducts(category = 'all') {
    productGrid.innerHTML = '';
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.category === 'lactose-free' ? 'Без лактози' : 
                   product.category === 'sugar-free' ? 'Без цукру' : 
                   product.category === 'sets' ? 'Набір' : ''}</p>
                <span class="product-price">${product.price} грн</span>
                <button class="add-to-cart" data-id="${product.id}">Додати в кошик</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });

    // Додавання обробників кнопок "Додати в кошик"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            addToCart(product);
        });
    });
}

// Фільтрація товарів
categoryBtns.forEach(button => {
    button.addEventListener('click', () => {
        categoryBtns.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        displayProducts(button.getAttribute('data-category'));
    });
});

// Додавання товару в кошик
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
}

// Оновлення кошика
function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.price} грн x ${item.quantity}</p>
            </div>
            <span class="cart-item-price">${item.price * item.quantity} грн</span>
            <span class="remove-item" data-id="${item.id}">&times;</span>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    });

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });

    cartTotalPrice.textContent = `${total} грн`;
    document.querySelector('.cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Видалення товару з кошика
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Оновлення підсумку замовлення
function updateOrderSummary() {
    let summaryHTML = '<h3>Ваше замовлення:</h3><ul>';
    cart.forEach(item => {
        summaryHTML += `<li>${item.name} - ${item.quantity} x ${item.price} грн = ${item.quantity * item.price} грн</li>`;
    });
    summaryHTML += `</ul><p><strong>Всього: ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)} грн</strong></p>`;
    orderItemsSummary.innerHTML = summaryHTML;

    // Додаємо товари до форми для відправки
    const orderItemsInput = document.createElement('input');
    orderItemsInput.type = 'hidden';
    orderItemsInput.name = 'order_items';
    orderItemsInput.value = cart.map(item => `${item.name} (${item.quantity} x ${item.price} грн)`).join(', ');
    orderForm.appendChild(orderItemsInput);
}

// Відправка форми
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Дякуємо за замовлення! Ми зв\'яжемося з вами найближчим часом.');
    cart = [];
    updateCart();
    orderFormModal.style.display = 'none';
    // Відправляємо форму (FormSubmit.co обробляє автоматично)
    orderForm.submit();
});

// Ініціалізація
displayProducts();