import {
    getProductById
} from "./products.js";

const $ = (selector) =>
    document.querySelector(selector);

const $$ = (selector) =>
    document.querySelectorAll(selector);

export const elements = {
    productGrid:
        $("#productGrid"),

    emptyState:
        $("#emptyState"),

    searchInput:
        $("#searchInput"),

    filters:
        $("#filters"),

    categoryButtons:
        $$("[data-category]"),

    openCartBtn:
        $("#openCartBtn"),

    closeCartBtn:
        $("#closeCartBtn"),

    cartDrawer:
        $("#cartDrawer"),

    cartOverlay:
        $("#cartOverlay"),

    cartItems:
        $("#cartItems"),

    cartSubtotal:
        $("#cartSubtotal"),

    cartTotal:
        $("#cartTotal"),

    cartCount:
        $("#cartCount"),

    checkoutBtn:
        $("#checkoutBtn"),

    menuBtn:
        $("#menuBtn"),

    mobileMenu:
        $("#mobileMenu"),

    mobileNavLinks:
        $$(".mobile-nav-link"),

    contactForm:
        $("#contactForm"),

    toast:
        $("#toast"),

    weatherLocation:
        $("#weatherLocation"),

    weatherTemp:
        $("#weatherTemp"),

    weatherDescription:
        $("#weatherDescription"),

    weatherIcon:
        $("#weatherIcon"),

    productTemplate:
        $("#productTemplate"),

    cartItemTemplate:
        $("#cartItemTemplate"),

    emptyCartTemplate:
        $("#emptyCartTemplate")
};

const weatherTemplates = {
    sun:
        $("#weatherSunTemplate"),

    moon:
        $("#weatherMoonTemplate"),

    cloud:
        $("#weatherCloudTemplate"),

    rain:
        $("#weatherRainTemplate"),

    snow:
        $("#weatherSnowTemplate"),

    storm:
        $("#weatherStormTemplate")
};

const currencyFormatter =
    new Intl.NumberFormat(
        "es-PY",
        {
            maximumFractionDigits: 0
        }
    );

let toastTimer;

export function renderProducts(products) {
    const fragment =
        document.createDocumentFragment();

    products.forEach((product) => {
        const card =
            createProductElement(product);

        fragment.appendChild(card);
    });

    elements.productGrid.replaceChildren(
        fragment
    );

    elements.emptyState.hidden =
        products.length !== 0;
}

export function setActiveFilter(category) {
    elements.filters
        .querySelectorAll(
            "[data-filter]"
        )
        .forEach((button) => {
            button.classList.toggle(
                "active-filter",
                button.dataset.filter ===
                    category
            );
        });
}

export function renderCart(cart) {
    if (!cart.length) {
        const empty =
            elements.emptyCartTemplate
                .content
                .firstElementChild
                .cloneNode(true);

        elements.cartItems
            .replaceChildren(empty);

        renderCartSummary(0, 0);

        return;
    }

    const fragment =
        document.createDocumentFragment();

    let quantity = 0;
    let total = 0;

    cart.forEach((item) => {
        const product =
            getProductById(item.id);

        if (!product) {
            return;
        }

        quantity +=
            item.cantidad;

        total +=
            product.precio *
            item.cantidad;

        const cartItem =
            createCartItemElement(
                product,
                item.cantidad
            );

        fragment.appendChild(
            cartItem
        );
    });

    elements.cartItems
        .replaceChildren(fragment);

    renderCartSummary(
        quantity,
        total
    );
}

export function setCartOpen(isOpen) {
    const state =
        String(isOpen);

    elements.cartDrawer.dataset.open =
        state;

    elements.cartOverlay.dataset.open =
        state;

    elements.cartDrawer.setAttribute(
        "aria-hidden",
        String(!isOpen)
    );

    elements.cartOverlay.setAttribute(
        "aria-hidden",
        String(!isOpen)
    );

    elements.openCartBtn.setAttribute(
        "aria-expanded",
        state
    );

    document.body.dataset.scrollLocked =
        state;
}

export function setMobileMenu(isOpen) {
    elements.mobileMenu.hidden =
        !isOpen;

    elements.menuBtn.setAttribute(
        "aria-expanded",
        String(isOpen)
    );
}

export function renderWeather(weather) {
    elements.weatherLocation.textContent =
        weather.city;

    elements.weatherTemp.textContent =
        `${weather.temperature}°C`;

    elements.weatherDescription.textContent =
        weather.description;

    setWeatherIcon(
        weather.icon
    );
}

export function renderWeatherLoading() {
    elements.weatherLocation.textContent =
        "Detectando ubicación...";

    elements.weatherTemp.textContent =
        "--";

    elements.weatherDescription.textContent =
        "Cargando clima";

    setWeatherIcon("sun");
}

export function renderWeatherError() {
    elements.weatherLocation.textContent =
        "Carapeguá";

    elements.weatherTemp.textContent =
        "--";

    elements.weatherDescription.textContent =
        "Clima no disponible";

    setWeatherIcon("cloud");
}

export function showToast(message) {
    clearTimeout(toastTimer);

    elements.toast.textContent =
        message;

    elements.toast.dataset.visible =
        "true";

    toastTimer =
        setTimeout(() => {
            elements.toast.dataset.visible =
                "false";
        }, 2300);
}

function createProductElement(product) {
    const card =
        elements.productTemplate
            .content
            .firstElementChild
            .cloneNode(true);

    const image =
        card.querySelector(
            ".product-card-image"
        );

    image.src =
        product.imagen;

    image.alt =
        product.nombre;

    card.querySelector(
        ".product-badge"
    ).textContent =
        product.categoria;

    card.querySelector(
        ".product-price"
    ).textContent =
        formatCurrency(
            product.precio
        );

    card.querySelector(
        ".product-title"
    ).textContent =
        product.nombre;

    card.querySelector(
        ".product-description"
    ).textContent =
        product.descripcion;

    card.querySelector(
        ".product-add-button"
    ).dataset.addProduct =
        String(product.id);

    return card;
}

function createCartItemElement(
    product,
    quantity
) {
    const item =
        elements.cartItemTemplate
            .content
            .firstElementChild
            .cloneNode(true);

    const image =
        item.querySelector(
            ".cart-item-image"
        );

    image.src =
        product.imagen;

    image.alt =
        product.nombre;

    item.querySelector(
        ".cart-item-title"
    ).textContent =
        product.nombre;

    item.querySelector(
        ".cart-item-price"
    ).textContent =
        formatCurrency(
            product.precio
        );

    item.querySelector(
        ".quantity-value"
    ).textContent =
        String(quantity);

    item.querySelectorAll(
        "[data-cart-action]"
    ).forEach((button) => {
        button.dataset.productId =
            String(product.id);
    });

    return item;
}

function renderCartSummary(
    quantity,
    total
) {
    elements.cartCount.textContent =
        String(quantity);

    const formattedTotal =
        formatCurrency(total);

    elements.cartSubtotal.textContent =
        formattedTotal;

    elements.cartTotal.textContent =
        formattedTotal;
}

function setWeatherIcon(icon) {
    const template =
        weatherTemplates[icon] ||
        weatherTemplates.cloud;

    const svg =
        template.content
            .firstElementChild
            .cloneNode(true);

    elements.weatherIcon
        .replaceChildren(svg);
}

function formatCurrency(value) {
    return `Gs. ${
        currencyFormatter.format(value)
    }`;
}