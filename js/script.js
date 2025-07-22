/*
    Kylie's Skin - Modern Skincare Website
    JavaScript Functionality
*/

// Wait for the DOM to be fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', function() {
    // Global Variables
    const navMenu = document.querySelector('.nav-menu');
    const mobileToggle = document.getElementById('mobile-toggle');
    const cartToggle = document.getElementById('cart-toggle');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.getElementById('close-cart');
    const overlay = document.getElementById('overlay');
    const productGrid = document.querySelector('.product-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalPriceElement = document.querySelector('.total-price');
    const clearCartBtn = document.querySelector('.clear-cart-btn');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('kylieSkinCart')) || [];
    let currentSlide = 0;

    // Sample product data
    const products = [
        {
            id: 1,
            name: 'Hydrating Facial Serum',
            price: 699.99,
            originalPrice: 899.99,
            icon: 'fas fa-tint',
            category: 'face',
            tag: 'Best Seller'
        },
        {
            id: 2,
            name: 'Brightening Face Mask',
            price: 449.99,
            originalPrice: 549.99,
            icon: 'fas fa-mask',
            category: 'face',
            tag: 'New'
        },
        {
            id: 3,
            name: 'Daily Moisturizer',
            price: 619.99,
            originalPrice: null,
            icon: 'fas fa-hand-holding-water',
            category: 'face',
            tag: null
        },
        {
            id: 4,
            name: 'Body Scrub Collection',
            price: 899.99,
            originalPrice: 1099.99,
            icon: 'fas fa-spa',
            category: 'body',
            tag: '15% Off'
        },
        {
            id: 5,
            name: 'Nourishing Body Lotion',
            price: 529.99,
            originalPrice: null,
            icon: 'fas fa-pump-soap',
            category: 'body',
            tag: null
        },
        {
            id: 6,
            name: 'Complete Skincare Set',
            price: 1799.99,
            originalPrice: 2349.99,
            icon: 'fas fa-gift',
            category: 'sets',
            tag: 'Value Pack'
        },
        {
            id: 7,
            name: 'Anti-aging Eye Cream',
            price: 769.99,
            originalPrice: 899.99,
            icon: 'fas fa-eye',
            category: 'face',
            tag: 'Popular'
        },
        {
            id: 8,
            name: 'Ultimate Facial Cleansing Kit',
            price: 1249.99,
            originalPrice: 1439.99,
            icon: 'fas fa-boxes',
            category: 'sets',
            tag: 'Limited Edition'
        }
    ];

    // Function to render all products
    function renderProducts(category = 'all') {
        let html = '';
        let filteredProducts = category === 'all' ? products : products.filter(product => product.category === category);
        
        filteredProducts.forEach(product => {
            html += `
                <div class="product-card" data-id="${product.id}">
                    <div class="product-image">
                        <i class="${product.icon}"></i>
                        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ''}
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-price">
                            <div>
                                ${product.originalPrice ? `<span class="original-price">R${product.originalPrice}</span>` : ''}
                                <span class="price">R${product.price}</span>
                            </div>
                        </div>
                        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            `;
        });
        
        productGrid.innerHTML = html;
        
        // Add event listeners to new Add to Cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', handleAddToCart);
        });
        
        // Re-animate product cards if they're in view
        setTimeout(() => {
            if (isElementInViewport(document.querySelector('.product-filter'))) {
                animateProductCards();
            }
        }, 100);
    }

    // Function to handle adding products to cart
    function handleAddToCart(e) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        const product = products.find(item => item.id === productId);
        
        // Check if product already exists in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                icon: product.icon,
                quantity: 1
            });
        }
        
        // Save cart to localStorage
        saveCart();
        
        // Update cart display
        updateCartDisplay();
        
        // Show notification
        showNotification(`${product.name} added to cart!`);
        
        // Open cart sidebar
        openCart();
    }

    // Function to update cart display
    function updateCartDisplay() {
        // Update cart count
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Render cart items
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
            totalPriceElement.textContent = 'R0.00';
            return;
        }
        
        let html = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            html += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <i class="${item.icon}"></i>
                    </div>
                    <div class="cart-item-info">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <p class="cart-item-price">R${item.price}</p>
                        <div class="cart-item-quantity">
                            <button class="qty-btn minus-btn" data-id="${item.id}">-</button>
                            <input type="text" class="qty-input" value="${item.quantity}" readonly>
                            <button class="qty-btn plus-btn" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = html;
        totalPriceElement.textContent = `R${total.toFixed(2)}`;
        
        // Add event listeners to quantity buttons and remove buttons
        document.querySelectorAll('.minus-btn').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });
        
        document.querySelectorAll('.plus-btn').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', removeItem);
        });
    }

    // Function to decrease item quantity
    function decreaseQuantity(e) {
        const id = parseInt(e.target.getAttribute('data-id'));
        const cartItem = cart.find(item => item.id === id);
        
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        } else {
            cart = cart.filter(item => item.id !== id);
        }
        
        saveCart();
        updateCartDisplay();
    }

    // Function to increase item quantity
    function increaseQuantity(e) {
        const id = parseInt(e.target.getAttribute('data-id'));
        const cartItem = cart.find(item => item.id === id);
        cartItem.quantity += 1;
        
        saveCart();
        updateCartDisplay();
    }

    // Function to remove item from cart
    function removeItem(e) {
        const id = parseInt(e.target.closest('.remove-item').getAttribute('data-id'));
        cart = cart.filter(item => item.id !== id);
        
        saveCart();
        updateCartDisplay();
    }

    // Function to save cart to localStorage
    function saveCart() {
        localStorage.setItem('kylieSkinCart', JSON.stringify(cart));
    }

    // Function to clear cart
    function clearCart() {
        cart = [];
        saveCart();
        updateCartDisplay();
    }

    // Function to handle checkout
    function checkout() {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        
        showNotification('Redirecting to checkout...');
        // Here you would typically redirect to a checkout page or open a checkout modal
        // For demo purposes, we'll just clear the cart after a short delay
        setTimeout(() => {
            alert('Thank you for your purchase!');
            clearCart();
            closeCartSidebar();
        }, 2000);
    }

    // Function to show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <p>${message}</p>
        `;
        
        document.body.appendChild(notification);
        
        // Add CSS for the notification
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '2000';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Function to handle mobile menu toggle
    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
        
        // Toggle hamburger menu animation
        const spans = mobileToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            spans.forEach(span => span.style = '');
        }
    }

    // Function to open cart sidebar
    function openCart() {
        cartSidebar.classList.add('open');
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Function to close cart sidebar
    function closeCartSidebar() {
        cartSidebar.classList.remove('open');
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Function to handle testimonial slider
    function showSlide(index) {
        // Hide all slides
        testimonialSlides.forEach(slide => {
            slide.style.display = 'none';
        });
        
        // Show the current slide
        testimonialSlides[index].style.display = 'flex';
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonialSlides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
        showSlide(currentSlide);
    }

    // Function to handle scroll effects
    function handleScroll() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.padding = '5px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '10px 0';
            header.style.boxShadow = 'none';
        }
        
        // Trigger animations for elements on scroll
        animateOnScroll();
    }

    // Function to animate elements when they come into view
    function animateOnScroll() {
        const elements = document.querySelectorAll('.section-header, .about-content, .product-filter, .testimonial-slider, .feature-card, .gallery-item');
        
        elements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animate')) {
                element.classList.add('animate');
                
                // Animate product cards with staggered delay
                if (element.classList.contains('product-filter')) {
                    animateProductCards();
                }
            }
        });
    }

    // Function to check if element is in viewport
    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        ) || (
            rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }

    // Function to animate product cards with staggered delay
    function animateProductCards() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 100); // 100ms delay between each card
        });
    }

    // Function to handle smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
            
            // Scroll to the element
            const target = document.querySelector(this.getAttribute('href'));
            const headerOffset = 100; // Adjust this value based on your header height
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Function to handle form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            showNotification(`Thank you ${name}! Your message has been sent.`);
            contactForm.reset();
        });
    }

    // Event Listeners
    mobileToggle.addEventListener('click', toggleMobileMenu);
    cartToggle.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartSidebar);
    overlay.addEventListener('click', closeCartSidebar);
    
    clearCartBtn.addEventListener('click', clearCart);
    checkoutBtn.addEventListener('click', checkout);
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    window.addEventListener('scroll', handleScroll);

    // Filter product buttons event listeners
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Render filtered products
            renderProducts(filterValue);
        });
    });

    // Initialize the page
    renderProducts();
    updateCartDisplay();
    showSlide(currentSlide);
    
    // Initial scroll check for animations
    animateOnScroll();
});
