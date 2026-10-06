const STORAGE_KEY = "artelpy_carrito";

const DEFAULT_LOCATION = {
    city: "Carapeguá",
    latitude: -25.8,
    longitude: -56.82
};

const productos = [
    {
        id: 1,
        nombre: "Hamaca tradicional de poyvi",
        categoria: "Hamacas",
        precio: 280000,
        descripcion:
            "Hamaca artesanal inspirada en la tradición textil paraguaya, ideal para crear espacios de descanso con identidad.",
        imagen: "assets/img/hamaca.png"
    },
    {
        id: 2,
        nombre: "Poncho artesanal para dama",
        categoria: "Ponchos",
        precio: 350000,
        descripcion:
            "Poncho artesanal de diseño elegante, confeccionado con una estética inspirada en los tejidos tradicionales.",
        imagen: "assets/img/ponchodama.png"
    },
    {
        id: 3,
        nombre: "Termo forrado artesanal",
        categoria: "Termos",
        precio: 190000,
        descripcion:
            "Termo con revestimiento artesanal y detalles inspirados en elementos característicos de la artesanía paraguaya.",
        imagen: "assets/img/termoforr.png"
    },
    {
        id: 4,
        nombre: "Sobrecama artesanal",
        categoria: "Sobrecamas",
        precio: 420000,
        descripcion:
            "Sobrecama artesanal de gran detalle, ideal para aportar textura, calidez y personalidad a los ambientes.",
        imagen: "assets/img/sobrecama.png"
    },
    {
        id: 5,
        nombre: "Sombrero artesanal",
        categoria: "Accesorios",
        precio: 145000,
        descripcion:
            "Sombrero elaborado con inspiración en fibras naturales, de estética sencilla, tradicional y elegante.",
        imagen: "assets/img/sombrero.png"
    },
    {
        id: 6,
        nombre: "Almohada con detalle de ñandutí",
        categoria: "Accesorios",
        precio: 160000,
        descripcion:
            "Almohada decorativa con delicados detalles inspirados en el ñandutí paraguayo y sus motivos tradicionales.",
        imagen: "assets/img/almohada.png"
    }
];

const WEATHER_CODES = {
    0: "Despejado",
    1: "Mayormente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Neblina",
    48: "Neblina",
    51: "Llovizna leve",
    53: "Llovizna",
    55: "Llovizna intensa",
    61: "Lluvia leve",
    63: "Lluvia",
    65: "Lluvia intensa",
    71: "Nieve leve",
    73: "Nieve",
    75: "Nieve intensa",
    80: "Chaparrones leves",
    81: "Chaparrones",
    82: "Chaparrones intensos",
    95: "Tormenta",
    96: "Tormenta con granizo",
    99: "Tormenta fuerte"
};

const $ = (selector) =>
    document.querySelector(selector);

const $$ = (selector) =>
    document.querySelectorAll(selector);

const elements = {
    productGrid: $("#productGrid"),
    emptyState: $("#emptyState"),
    searchInput: $("#searchInput"),
    filters: $("#filters"),
    categoryButtons: $$("[data-category]"),

    openCartBtn: $("#openCartBtn"),
    closeCartBtn: $("#closeCartBtn"),
    cartDrawer: $("#cartDrawer"),
    cartOverlay: $("#cartOverlay"),
    cartItems: $("#cartItems"),
    cartSubtotal: $("#cartSubtotal"),
    cartTotal: $("#cartTotal"),
    cartCount: $("#cartCount"),
    checkoutBtn: $("#checkoutBtn"),

    menuBtn: $("#menuBtn"),
    mobileMenu: $("#mobileMenu"),
    mobileNavLinks: $$(".mobile-nav-link"),

    contactForm: $("#contactForm"),
    toast: $("#toast"),

    weatherLocation: $("#weatherLocation"),
    weatherTemp: $("#weatherTemp"),
    weatherDescription: $("#weatherDescription"),
    weatherIcon: $("#weatherIcon")
};

const state = {
    filtro: "Todos",
    busqueda: "",
    carrito: cargarCarrito()
};

const currencyFormatter =
    new Intl.NumberFormat("es-PY", {
        maximumFractionDigits: 0
    });

let toastTimer;


/* Inicialización */

function init() {
    renderProductos();
    renderCarrito();
    registrarEventos();
    cargarClimaInicial();
}


/* Eventos */

function registrarEventos() {
    elements.searchInput.addEventListener(
        "input",
        ({ target }) => {
            state.busqueda =
                normalizarTexto(target.value);

            renderProductos();
        }
    );

    elements.filters.addEventListener(
        "click",
        ({ target }) => {
            const button =
                target.closest("[data-filter]");

            if (!button) return;

            cambiarFiltro(
                button.dataset.filter
            );
        }
    );

    elements.categoryButtons.forEach(
        (button) => {
            button.addEventListener(
                "click",
                () => {
                    cambiarFiltro(
                        button.dataset.category
                    );

                    $("#productos").scrollIntoView({
                        behavior: "smooth"
                    });
                }
            );
        }
    );

    elements.productGrid.addEventListener(
        "click",
        ({ target }) => {
            const button =
                target.closest(
                    "[data-add-product]"
                );

            if (!button) return;

            agregarAlCarrito(
                Number(
                    button.dataset.addProduct
                )
            );
        }
    );

    elements.cartItems.addEventListener(
        "click",
        ({ target }) => {
            const button =
                target.closest(
                    "[data-cart-action]"
                );

            if (!button) return;

            manejarAccionCarrito(
                button.dataset.cartAction,
                Number(
                    button.dataset.productId
                )
            );
        }
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

    elements.checkoutBtn.addEventListener(
        "click",
        finalizarCompra
    );

    elements.menuBtn.addEventListener(
        "click",
        toggleMobileMenu
    );

    elements.mobileNavLinks.forEach(
        (link) => {
            link.addEventListener(
                "click",
                () => setMobileMenu(false)
            );
        }
    );

    elements.contactForm.addEventListener(
        "submit",
        (event) => {
            event.preventDefault();

            mostrarToast(
                "Mensaje enviado correctamente"
            );

            elements.contactForm.reset();
        }
    );

    document.addEventListener(
        "keydown",
        ({ key }) => {
            if (key !== "Escape") return;

            setCartOpen(false);
            setMobileMenu(false);
        }
    );
}


/* Productos */

function renderProductos() {
    const resultados =
        productos.filter((producto) => {
            const coincideCategoria =
                state.filtro === "Todos" ||
                producto.categoria === state.filtro;

            const texto =
                normalizarTexto(
                    `${producto.nombre} ${producto.categoria} ${producto.descripcion}`
                );

            return (
                coincideCategoria &&
                texto.includes(state.busqueda)
            );
        });

    elements.productGrid.innerHTML =
        resultados
            .map(crearProductoHTML)
            .join("");

    elements.emptyState.classList.toggle(
        "hidden",
        resultados.length > 0
    );
}

function crearProductoHTML(producto) {
    return `
        <article class="product-card">

            <img
                src="${producto.imagen}"
                alt="${producto.nombre}"
                class="product-card-image"
                loading="lazy"
            >

            <div class="p-6">

                <div class="flex items-center justify-between gap-3">

                    <span
                        class="
                            rounded-full
                            border
                            border-dorado/30
                            bg-dorado/10
                            px-3
                            py-1
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-[0.15em]
                            text-doradoClaro
                        "
                    >
                        ${producto.categoria}
                    </span>

                    <span class="text-base font-bold text-crema">
                        ${formatearMoneda(producto.precio)}
                    </span>

                </div>

                <h3 class="mt-5 font-display text-2xl font-bold text-crema">
                    ${producto.nombre}
                </h3>

                <p
                    class="
                        line-clamp-2
                        mt-3
                        min-h-[56px]
                        text-sm
                        leading-7
                        text-gris
                    "
                >
                    ${producto.descripcion}
                </p>

                <button
                    type="button"
                    data-add-product="${producto.id}"
                    class="
                        mt-6
                        w-full
                        rounded-full
                        bg-dorado
                        px-5
                        py-3
                        text-sm
                        font-bold
                        text-fondo
                        transition
                        hover:bg-doradoClaro
                    "
                >
                    Agregar al carrito
                </button>

            </div>

        </article>
    `;
}

function cambiarFiltro(filtro) {
    state.filtro = filtro;

    elements.filters
        .querySelectorAll("[data-filter]")
        .forEach((button) => {
            button.classList.toggle(
                "active-filter",
                button.dataset.filter === filtro
            );
        });

    renderProductos();
}


/* Carrito */

function manejarAccionCarrito(
    accion,
    productId
) {
    const acciones = {
        increase: () =>
            cambiarCantidad(productId, 1),

        decrease: () =>
            cambiarCantidad(productId, -1),

        remove: () =>
            eliminarDelCarrito(productId)
    };

    acciones[accion]?.();
}

function agregarAlCarrito(productId) {
    const producto =
        obtenerProducto(productId);

    if (!producto) return;

    const item =
        state.carrito.find(
            ({ id }) => id === productId
        );

    if (item) {
        item.cantidad += 1;
    } else {
        state.carrito.push({
            id: productId,
            cantidad: 1
        });
    }

    sincronizarCarrito();

    mostrarToast(
        `${producto.nombre} agregado al carrito`
    );
}

function cambiarCantidad(
    productId,
    diferencia
) {
    const item =
        state.carrito.find(
            ({ id }) => id === productId
        );

    if (!item) return;

    item.cantidad += diferencia;

    if (item.cantidad <= 0) {
        eliminarDelCarrito(
            productId,
            false
        );
        return;
    }

    sincronizarCarrito();
}

function eliminarDelCarrito(
    productId,
    notificar = true
) {
    state.carrito =
        state.carrito.filter(
            ({ id }) => id !== productId
        );

    sincronizarCarrito();

    if (notificar) {
        mostrarToast(
            "Producto eliminado del carrito"
        );
    }
}

function renderCarrito() {
    elements.cartItems.innerHTML =
        state.carrito.length
            ? state.carrito
                  .map(crearItemCarritoHTML)
                  .join("")
            : crearCarritoVacioHTML();

    actualizarResumenCarrito();
}

function crearCarritoVacioHTML() {
    return `
        <div
            class="
                rounded-3xl
                border
                border-linea
                bg-fondo
                p-8
                text-center
            "
        >
            <h3 class="font-display text-2xl font-bold text-crema">
                Tu carrito está vacío
            </h3>

            <p class="mt-3 text-sm leading-6 text-gris">
                Agregá productos del catálogo
                para comenzar tu compra.
            </p>
        </div>
    `;
}

function crearItemCarritoHTML(item) {
    const producto =
        obtenerProducto(item.id);

    if (!producto) return "";

    return `
        <article
            class="
                rounded-[22px]
                border
                border-linea
                bg-fondo
                p-4
            "
        >

            <div class="flex gap-4">

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                    class="h-24 w-24 rounded-xl object-cover"
                >

                <div class="flex-1">

                    <h3 class="font-display text-lg font-bold text-crema">
                        ${producto.nombre}
                    </h3>

                    <p class="mt-1 text-sm font-semibold text-doradoClaro">
                        ${formatearMoneda(producto.precio)}
                    </p>

                    <div class="mt-4 flex items-center justify-between gap-3">

                        <div
                            class="
                                flex
                                items-center
                                rounded-full
                                border
                                border-linea
                                bg-superficie
                            "
                        >

                            <button
                                type="button"
                                data-cart-action="decrease"
                                data-product-id="${producto.id}"
                                class="px-4 py-2 font-bold text-crema"
                                aria-label="Disminuir cantidad"
                            >
                                −
                            </button>

                            <span class="min-w-6 text-center text-sm font-semibold text-crema">
                                ${item.cantidad}
                            </span>

                            <button
                                type="button"
                                data-cart-action="increase"
                                data-product-id="${producto.id}"
                                class="px-4 py-2 font-bold text-crema"
                                aria-label="Aumentar cantidad"
                            >
                                +
                            </button>

                        </div>

                        <button
                            type="button"
                            data-cart-action="remove"
                            data-product-id="${producto.id}"
                            class="text-xs font-semibold text-dorado transition hover:text-doradoClaro"
                        >
                            Eliminar
                        </button>

                    </div>

                </div>

            </div>

        </article>
    `;
}

function actualizarResumenCarrito() {
    const resumen =
        state.carrito.reduce(
            (total, item) => {
                const producto =
                    obtenerProducto(item.id);

                if (!producto) {
                    return total;
                }

                total.cantidad +=
                    item.cantidad;

                total.precio +=
                    producto.precio *
                    item.cantidad;

                return total;
            },
            {
                cantidad: 0,
                precio: 0
            }
        );

    elements.cartCount.textContent =
        resumen.cantidad;

    elements.cartSubtotal.textContent =
        formatearMoneda(
            resumen.precio
        );

    elements.cartTotal.textContent =
        formatearMoneda(
            resumen.precio
        );
}

function sincronizarCarrito() {
    guardarCarrito();
    renderCarrito();
}

function obtenerProducto(productId) {
    return productos.find(
        ({ id }) => id === productId
    );
}


/* LocalStorage */

function cargarCarrito() {
    try {
        const datos =
            JSON.parse(
                localStorage.getItem(
                    STORAGE_KEY
                ) || "[]"
            );

        if (!Array.isArray(datos)) {
            return [];
        }

        return datos.filter(
            (item) =>
                Number.isInteger(item.id) &&
                Number.isInteger(
                    item.cantidad
                ) &&
                item.cantidad > 0 &&
                productos.some(
                    ({ id }) =>
                        id === item.id
                )
        );
    } catch (error) {
        console.error(
            "No se pudo cargar el carrito:",
            error
        );

        return [];
    }
}

function guardarCarrito() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                state.carrito
            )
        );
    } catch (error) {
        console.error(
            "No se pudo guardar el carrito:",
            error
        );
    }
}


/* Paneles */

function setCartOpen(isOpen) {
    elements.cartDrawer.classList.toggle(
        "translate-x-full",
        !isOpen
    );

    elements.cartOverlay.classList.toggle(
        "opacity-0",
        !isOpen
    );

    elements.cartOverlay.classList.toggle(
        "invisible",
        !isOpen
    );

    elements.cartDrawer.setAttribute(
        "aria-hidden",
        String(!isOpen)
    );

    elements.openCartBtn.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    document.body.style.overflow =
        isOpen ? "hidden" : "";
}

function toggleMobileMenu() {
    setMobileMenu(
        elements.mobileMenu.classList.contains(
            "hidden"
        )
    );
}

function setMobileMenu(isOpen) {
    elements.mobileMenu.classList.toggle(
        "hidden",
        !isOpen
    );

    elements.menuBtn.setAttribute(
        "aria-expanded",
        String(isOpen)
    );
}


/* Checkout */

function finalizarCompra() {
    if (!state.carrito.length) {
        mostrarToast(
            "Tu carrito está vacío"
        );
        return;
    }

    state.carrito = [];

    sincronizarCarrito();

    mostrarToast(
        "Pedido realizado correctamente"
    );

    setTimeout(
        () => setCartOpen(false),
        900
    );
}


/* Clima */

async function cargarClimaInicial() {
    mostrarEstadoClima(
        "Detectando ubicación...",
        "--",
        "Cargando clima"
    );

    try {
        const ubicacion =
            await obtenerUbicacionPorIP();

        await cargarClima(
            ubicacion
        );
    } catch (error) {
        console.warn(
            "Se utilizará Carapeguá como ubicación de respaldo.",
            error
        );

        try {
            await cargarClima(
                DEFAULT_LOCATION
            );
        } catch (weatherError) {
            console.error(
                "No se pudo cargar el clima:",
                weatherError
            );

            mostrarEstadoClima(
                DEFAULT_LOCATION.city,
                "--",
                "Clima no disponible"
            );
        }
    }
}

async function obtenerUbicacionPorIP() {
    const data =
        await fetchJSON(
            "https://ipapi.co/json/"
        );

    const latitude =
        Number(data.latitude);

    const longitude =
        Number(data.longitude);

    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {
        throw new Error(
            "Coordenadas inválidas."
        );
    }

    return {
        city:
            data.city ||
            data.region ||
            "Tu ubicación",

        latitude,
        longitude
    };
}

async function cargarClima({
    city,
    latitude,
    longitude
}) {
    mostrarEstadoClima(
        city,
        "--",
        "Actualizando..."
    );

    const clima =
        await obtenerClimaActual(
            latitude,
            longitude
        );

    elements.weatherLocation.textContent =
        city;

    elements.weatherTemp.textContent =
        `${clima.temperature}°C`;

    elements.weatherDescription.textContent =
        WEATHER_CODES[
            clima.weatherCode
        ] || "Clima actual";

    elements.weatherIcon.innerHTML =
        obtenerIconoClima(
            clima.weatherCode,
            clima.isDay
        );
}

async function obtenerClimaActual(
    latitude,
    longitude
) {
    const url =
        new URL(
            "https://api.open-meteo.com/v1/forecast"
        );

    url.searchParams.set(
        "latitude",
        latitude
    );

    url.searchParams.set(
        "longitude",
        longitude
    );

    url.searchParams.set(
        "current_weather",
        "true"
    );

    url.searchParams.set(
        "timezone",
        "auto"
    );

    const data =
        await fetchJSON(
            url.toString()
        );

    if (!data.current_weather) {
        throw new Error(
            "No se recibieron datos meteorológicos."
        );
    }

    return {
        temperature:
            Math.round(
                data.current_weather
                    .temperature
            ),

        weatherCode:
            data.current_weather
                .weathercode,

        isDay:
            data.current_weather
                .is_day
    };
}

async function fetchJSON(
    url,
    timeout = 10000
) {
    const controller =
        new AbortController();

    const timeoutId =
        setTimeout(
            () =>
                controller.abort(),
            timeout
        );

    try {
        const response =
            await fetch(url, {
                signal:
                    controller.signal
            });

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        return await response.json();
    } finally {
        clearTimeout(timeoutId);
    }
}

function mostrarEstadoClima(
    ciudad,
    temperatura,
    descripcion
) {
    elements.weatherLocation.textContent =
        ciudad;

    elements.weatherTemp.textContent =
        temperatura;

    elements.weatherDescription.textContent =
        descripcion;

    elements.weatherIcon.innerHTML =
        WEATHER_ICONS.sun;
}

function obtenerIconoClima(
    code,
    isDay
) {
    if (code === 0) {
        return isDay
            ? WEATHER_ICONS.sun
            : WEATHER_ICONS.moon;
    }

    if (
        [1, 2, 3, 45, 48].includes(
            code
        )
    ) {
        return WEATHER_ICONS.cloud;
    }

    if (
        [
            51,
            53,
            55,
            61,
            63,
            65,
            80,
            81,
            82
        ].includes(code)
    ) {
        return WEATHER_ICONS.rain;
    }

    if (
        [71, 73, 75].includes(code)
    ) {
        return WEATHER_ICONS.snow;
    }

    if (
        [95, 96, 99].includes(code)
    ) {
        return WEATHER_ICONS.storm;
    }

    return WEATHER_ICONS.cloud;
}


/* Utilidades */

function formatearMoneda(valor) {
    return `Gs. ${currencyFormatter.format(
        valor
    )}`;
}

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim();
}

function mostrarToast(mensaje) {
    clearTimeout(toastTimer);

    elements.toast.textContent =
        mensaje;

    elements.toast.classList.remove(
        "opacity-0",
        "translate-y-4"
    );

    elements.toast.classList.add(
        "opacity-100",
        "translate-y-0"
    );

    toastTimer =
        setTimeout(() => {
            elements.toast.classList.remove(
                "opacity-100",
                "translate-y-0"
            );

            elements.toast.classList.add(
                "opacity-0",
                "translate-y-4"
            );
        }, 2300);
}


/* Iconos clima */

const WEATHER_ICONS = {
    sun: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24" stroke-width="1.8"
             stroke="currentColor">
            <path stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 3v1.5m0 15V21m9-9h-1.5M4.5 12H3m15.364 6.364-1.061-1.061M6.697 6.697 5.636 5.636m12.728 0-1.061 1.061M6.697 17.303l-1.061 1.061M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"/>
        </svg>
    `,

    moon: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24" stroke-width="1.8"
             stroke="currentColor">
            <path stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"/>
        </svg>
    `,

    cloud: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24" stroke-width="1.8"
             stroke="currentColor">
            <path stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5h10.5a4.5 4.5 0 0 0 .09-9 6 6 0 0 0-11.62-1.406A4.502 4.502 0 0 0 2.25 15Z"/>
        </svg>
    `,

    rain: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24" stroke-width="1.8"
             stroke="currentColor">
            <path stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 14.25a4.5 4.5 0 0 0 4.5 4.5h10.5a4.5 4.5 0 0 0 .09-9 6 6 0 0 0-11.62-1.406A4.502 4.502 0 0 0 2.25 14.25Zm5.25 5.25-.75 1.5m4.5-1.5-.75 1.5m4.5-1.5-.75 1.5"/>
        </svg>
    `,

    snow: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24" stroke-width="1.8"
             stroke="currentColor">
            <path stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 3v18m-7.794-4.5 15.588-9M4.206 7.5l15.588 9M8.25 5.25 12 7.5l3.75-2.25M8.25 18.75 12 16.5l3.75 2.25"/>
        </svg>
    `,

    storm: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24" stroke-width="1.8"
             stroke="currentColor">
            <path stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 15a4.5 4.5 0 0 0 4.5 4.5h8.25a4.5 4.5 0 1 0 .09-9 6 6 0 0 0-11.62-1.406A4.502 4.502 0 0 0 3 15Zm8.25 1.5L9.75 21H12l-1.5 3 4.5-5.25h-2.25l1.5-2.25Z"/>
        </svg>
    `
};

init();