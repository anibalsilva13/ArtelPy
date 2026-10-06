import {
    filterProducts,
    getProductById,
    hasProduct
} from "./products.js";

import {
    loadCart,
    saveCart
} from "./storage.js";

import {
    getWeather
} from "./weather.js";

import {
    elements,
    renderProducts,
    renderCart,
    renderWeather,
    renderWeatherLoading,
    renderWeatherError,
    setActiveFilter,
    setCartOpen,
    setMobileMenu,
    showToast
} from "./ui.js";

const state = {
    category: "Todos",
    search: "",
    cart: loadCart(hasProduct)
};

function init() {
    renderCatalog();
    renderCart(state.cart);
    registerEvents();
    loadWeather();
}

function registerEvents() {
    elements.searchInput.addEventListener(
        "input",
        handleSearch
    );

    elements.filters.addEventListener(
        "click",
        handleFilter
    );

    elements.categoryButtons.forEach(
        (button) => {
            button.addEventListener(
                "click",
                handleCategoryShortcut
            );
        }
    );

    elements.productGrid.addEventListener(
        "click",
        handleProductAction
    );

    elements.cartItems.addEventListener(
        "click",
        handleCartAction
    );

    elements.openCartBtn.addEventListener(
        "click",
        () => setCartOpen(true)
    );

    elements.closeCartBtn.addEventListener(
        "click",
        () => setCartOpen(false)
    );

    elements.cartOverlay.addEventListener(
        "click",
        () => setCartOpen(false)
    );

    elements.menuBtn.addEventListener(
        "click",
        toggleMobileMenu
    );

    elements.checkoutBtn.addEventListener(
        "click",
        finalizePurchase
    );

    elements.contactForm.addEventListener(
        "submit",
        handleContactSubmit
    );

    elements.mobileNavLinks.forEach(
        (link) => {
            link.addEventListener(
                "click",
                () =>
                    setMobileMenu(false)
            );
        }
    );

    document.addEventListener(
        "keydown",
        handleKeyboard
    );
}

function handleSearch({ target }) {
    state.search =
        target.value;

    renderCatalog();
}

function handleFilter({ target }) {
    const button =
        target.closest(
            "[data-filter]"
        );

    if (!button) {
        return;
    }

    changeCategory(
        button.dataset.filter
    );
}

function handleCategoryShortcut({
    currentTarget
}) {
    changeCategory(
        currentTarget.dataset.category
    );

    document
        .getElementById("productos")
        .scrollIntoView({
            behavior: "smooth"
        });
}

function handleProductAction({
    target
}) {
    const button =
        target.closest(
            "[data-add-product]"
        );

    if (!button) {
        return;
    }

    addToCart(
        Number(
            button.dataset.addProduct
        )
    );
}

function handleCartAction({ target }) {
    const button =
        target.closest(
            "[data-cart-action]"
        );

    if (!button) {
        return;
    }

    const productId =
        Number(
            button.dataset.productId
        );

    switch (
        button.dataset.cartAction
    ) {
        case "increase":
            changeQuantity(
                productId,
                1
            );
            break;

        case "decrease":
            changeQuantity(
                productId,
                -1
            );
            break;

        case "remove":
            removeFromCart(
                productId
            );
            break;
    }
}

function handleContactSubmit(event) {
    event.preventDefault();

    elements.contactForm.reset();

    showToast(
        "Mensaje enviado correctamente"
    );
}

function handleKeyboard({ key }) {
    if (key !== "Escape") {
        return;
    }

    setCartOpen(false);
    setMobileMenu(false);
}

function changeCategory(category) {
    state.category =
        category;

    setActiveFilter(category);

    renderCatalog();
}

function renderCatalog() {
    const products =
        filterProducts(
            state.category,
            state.search
        );

    renderProducts(products);
}

function addToCart(productId) {
    const product =
        getProductById(productId);

    if (!product) {
        return;
    }

    const item =
        state.cart.find(
            ({ id }) =>
                id === productId
        );

    if (item) {
        item.cantidad += 1;
    } else {
        state.cart.push({
            id: productId,
            cantidad: 1
        });
    }

    syncCart();

    showToast(
        `${product.nombre} agregado al carrito`
    );
}

function changeQuantity(
    productId,
    difference
) {
    const item =
        state.cart.find(
            ({ id }) =>
                id === productId
        );

    if (!item) {
        return;
    }

    item.cantidad +=
        difference;

    if (item.cantidad <= 0) {
        removeFromCart(
            productId,
            false
        );

        return;
    }

    syncCart();
}

function removeFromCart(
    productId,
    notify = true
) {
    state.cart =
        state.cart.filter(
            ({ id }) =>
                id !== productId
        );

    syncCart();

    if (notify) {
        showToast(
            "Producto eliminado del carrito"
        );
    }
}

function syncCart() {
    saveCart(state.cart);
    renderCart(state.cart);
}

function toggleMobileMenu() {
    setMobileMenu(
        elements.mobileMenu.hidden
    );
}

function finalizePurchase() {
    if (!state.cart.length) {
        showToast(
            "Tu carrito está vacío"
        );

        return;
    }

    state.cart = [];

    syncCart();

    showToast(
        "Pedido realizado correctamente"
    );

    setTimeout(
        () =>
            setCartOpen(false),
        900
    );
}

async function loadWeather() {
    renderWeatherLoading();

    try {
        const weather =
            await getWeather();

        renderWeather(weather);
    } catch (error) {
        console.error(
            "No se pudo cargar el clima:",
            error
        );

        renderWeatherError();
    }
}

init();