const STORAGE_KEY = "artelpy_carrito";

const productos = [
    {
        id: 1,
        nombre: "Hamaca tradicional de poyvi",
        categoria: "Hamacas",
        precio: 280000,
        descripcion:
            "Hamaca artesanal elaborada con inspiración en la tradición textil paraguaya, ideal para espacios de descanso.",
        imagen: "assets/img/hamaca.png",
        destacado: true
    },

    {
        id: 2,
        nombre: "Poncho artesanal para dama",
        categoria: "Ponchos",
        precio: 350000,
        descripcion:
            "Poncho artesanal de diseño elegante, confeccionado con una estética inspirada en los tejidos tradicionales.",
        imagen: "assets/img/ponchodama.png",
        destacado: true
    },

    {
        id: 3,
        nombre: "Termo forrado artesanal",
        categoria: "Termos",
        precio: 190000,
        descripcion:
            "Termo con revestimiento artesanal y detalles inspirados en elementos característicos de la artesanía paraguaya.",
        imagen: "assets/img/termoforr.png",
        destacado: true
    },

    {
        id: 4,
        nombre: "Sobrecama artesanal",
        categoria: "Sobrecamas",
        precio: 420000,
        descripcion:
            "Sobrecama tejida de gran detalle, ideal para aportar textura, calidez y un estilo artesanal a los ambientes.",
        imagen: "assets/img/sobrecama.png",
        destacado: false
    },

    {
        id: 5,
        nombre: "Sombrero artesanal",
        categoria: "Accesorios",
        precio: 145000,
        descripcion:
            "Sombrero artesanal de fibras naturales con una estética sencilla, tradicional y elegante.",
        imagen: "assets/img/sombrero.png",
        destacado: false
    },

    {
        id: 6,
        nombre: "Almohada con detalle de ñandutí",
        categoria: "Accesorios",
        precio: 160000,
        descripcion:
            "Almohada decorativa con delicados detalles inspirados en el ñandutí paraguayo.",
        imagen: "assets/img/almohada.png",
        destacado: false
    }
];


/* =========================================
   ELEMENTOS DEL DOM
========================================= */

const productGrid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const categoryButtons =
    document.querySelectorAll(".category-btn");

const openCartBtn =
    document.getElementById("openCartBtn");

const closeCartBtn =
    document.getElementById("closeCartBtn");

const cartDrawer =
    document.getElementById("cartDrawer");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartItems =
    document.getElementById("cartItems");

const cartSubtotal =
    document.getElementById("cartSubtotal");

const cartTotal =
    document.getElementById("cartTotal");

const cartCount =
    document.getElementById("cartCount");

const toast =
    document.getElementById("toast");

const menuBtn =
    document.getElementById("menuBtn");

const mobileMenu =
    document.getElementById("mobileMenu");

const contactForm =
    document.getElementById("contactForm");

const checkoutBtn =
    document.getElementById("checkoutBtn");


/* =========================================
   ESTADO
========================================= */

let filtroActual = "Todos";

let busquedaActual = "";

let carrito = obtenerCarrito();


/* =========================================
   INICIALIZACIÓN
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        renderizarProductos();
        renderizarCarrito();
        inicializarEventos();
    }
);


/* =========================================
   EVENTOS
========================================= */

function inicializarEventos() {

    searchInput.addEventListener(
        "input",
        (event) => {

            busquedaActual =
                event.target.value
                    .toLowerCase()
                    .trim();

            renderizarProductos();

        }
    );


    filterButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    filtroActual =
                        button.dataset.filter;

                    actualizarFiltros();

                    renderizarProductos();

                }
            );

        }
    );


    categoryButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    filtroActual =
                        button.dataset.category;

                    actualizarFiltros();

                    renderizarProductos();

                    document
                        .getElementById("productos")
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                }
            );

        }
    );


    openCartBtn.addEventListener(
        "click",
        abrirCarrito
    );


    closeCartBtn.addEventListener(
        "click",
        cerrarCarrito
    );


    cartOverlay.addEventListener(
        "click",
        cerrarCarrito
    );


    menuBtn.addEventListener(
        "click",
        () => {

            mobileMenu.classList.toggle(
                "hidden"
            );

        }
    );


    contactForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            mostrarToast(
                "Mensaje enviado correctamente"
            );

            contactForm.reset();

        }
    );


    checkoutBtn.addEventListener(
        "click",
        finalizarCompra
    );

}


/* =========================================
   PRODUCTOS
========================================= */

function renderizarProductos() {

    productGrid.innerHTML = "";

    const resultado =
        productos.filter(
            (producto) => {

                const coincideCategoria =
                    filtroActual === "Todos" ||
                    producto.categoria ===
                    filtroActual;


                const textoProducto =
                    `
                        ${producto.nombre}
                        ${producto.descripcion}
                        ${producto.categoria}
                    `
                        .toLowerCase();


                const coincideBusqueda =
                    textoProducto.includes(
                        busquedaActual
                    );


                return (
                    coincideCategoria &&
                    coincideBusqueda
                );

            }
        );


    if (resultado.length === 0) {

        emptyState.classList.remove(
            "hidden"
        );

        return;

    }


    emptyState.classList.add(
        "hidden"
    );


    resultado.forEach(
        (producto) => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "product-card";


            card.innerHTML = `

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                    class="product-card-image"
                    loading="lazy"
                >

                <div class="p-6">

                    <div
                        class="
                            flex
                            items-center
                            justify-between
                            gap-3
                        "
                    >

                        <span
                            class="
                                rounded-full
                                bg-crema
                                px-3
                                py-1
                                text-[11px]
                                font-bold
                                uppercase
                                tracking-[0.15em]
                                text-terracota
                            "
                        >
                            ${producto.categoria}
                        </span>

                        <span
                            class="
                                text-base
                                font-bold
                                text-verde
                            "
                        >
                            ${formatearMoneda(
                                producto.precio
                            )}
                        </span>

                    </div>

                    <h3
                        class="
                            mt-5
                            font-display
                            text-2xl
                            font-bold
                            text-verde
                        "
                    >
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
                        onclick="agregarAlCarrito(${producto.id})"
                        class="
                            mt-6
                            w-full
                            rounded-full
                            bg-verde
                            px-5
                            py-3
                            text-sm
                            font-bold
                            text-white
                            transition
                            hover:bg-[#2D5146]
                        "
                    >
                        Agregar al carrito
                    </button>

                </div>

            `;


            productGrid.appendChild(
                card
            );

        }
    );

}


/* =========================================
   FILTROS
========================================= */

function actualizarFiltros() {

    filterButtons.forEach(
        (button) => {

            const activo =
                button.dataset.filter ===
                filtroActual;


            button.classList.toggle(
                "active-filter",
                activo
            );

        }
    );

}


/* =========================================
   CARRITO
========================================= */

function agregarAlCarrito(idProducto) {

    const producto =
        productos.find(
            (item) =>
                item.id === idProducto
        );


    if (!producto) {
        return;
    }


    const productoExistente =
        carrito.find(
            (item) =>
                item.id === idProducto
        );


    if (productoExistente) {

        productoExistente.cantidad++;

    } else {

        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });

    }


    guardarCarrito();

    renderizarCarrito();


    mostrarToast(
        `${producto.nombre} agregado al carrito`
    );

}


/* =========================================
   RENDERIZAR CARRITO
========================================= */

function renderizarCarrito() {

    cartItems.innerHTML = "";


    if (carrito.length === 0) {

        cartItems.innerHTML = `

            <div
                class="
                    rounded-3xl
                    bg-crema
                    p-8
                    text-center
                "
            >

                <h4
                    class="
                        font-display
                        text-2xl
                        font-bold
                        text-verde
                    "
                >
                    Tu carrito está vacío
                </h4>

                <p
                    class="
                        mt-3
                        text-sm
                        leading-6
                        text-gris
                    "
                >
                    Agregá productos del catálogo
                    para comenzar tu compra.
                </p>

            </div>

        `;

    } else {

        carrito.forEach(
            (item) => {

                const article =
                    document.createElement(
                        "article"
                    );


                article.className =
                    `
                        rounded-[22px]
                        border
                        border-arena/60
                        bg-crema
                        p-4
                    `;


                article.innerHTML = `

                    <div class="flex gap-4">

                        <img
                            src="${item.imagen}"
                            alt="${item.nombre}"
                            class="
                                h-24
                                w-24
                                rounded-xl
                                object-cover
                            "
                        >

                        <div class="flex-1">

                            <h4
                                class="
                                    font-display
                                    text-lg
                                    font-bold
                                    text-verde
                                "
                            >
                                ${item.nombre}
                            </h4>

                            <p
                                class="
                                    mt-1
                                    text-sm
                                    font-semibold
                                    text-terracota
                                "
                            >
                                ${formatearMoneda(
                                    item.precio
                                )}
                            </p>

                            <div
                                class="
                                    mt-4
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <div
                                    class="
                                        flex
                                        items-center
                                        rounded-full
                                        border
                                        border-arena
                                        bg-white
                                    "
                                >

                                    <button
                                        onclick="cambiarCantidad(${item.id}, -1)"
                                        class="
                                            px-4
                                            py-2
                                            font-bold
                                            text-verde
                                        "
                                    >
                                        −
                                    </button>

                                    <span
                                        class="
                                            min-w-6
                                            text-center
                                            text-sm
                                            font-semibold
                                        "
                                    >
                                        ${item.cantidad}
                                    </span>

                                    <button
                                        onclick="cambiarCantidad(${item.id}, 1)"
                                        class="
                                            px-4
                                            py-2
                                            font-bold
                                            text-verde
                                        "
                                    >
                                        +
                                    </button>

                                </div>

                                <button
                                    onclick="eliminarDelCarrito(${item.id})"
                                    class="
                                        text-xs
                                        font-semibold
                                        text-red-600
                                    "
                                >
                                    Eliminar
                                </button>

                            </div>

                        </div>

                    </div>

                `;


                cartItems.appendChild(
                    article
                );

            }
        );

    }


    actualizarResumenCarrito();

}


/* =========================================
   CANTIDADES
========================================= */

function cambiarCantidad(
    idProducto,
    cantidad
) {

    const producto =
        carrito.find(
            (item) =>
                item.id === idProducto
        );


    if (!producto) {
        return;
    }


    producto.cantidad += cantidad;


    if (producto.cantidad <= 0) {

        eliminarDelCarrito(
            idProducto
        );

        return;

    }


    guardarCarrito();

    renderizarCarrito();

}


/* =========================================
   ELIMINAR
========================================= */

function eliminarDelCarrito(
    idProducto
) {

    carrito =
        carrito.filter(
            (item) =>
                item.id !== idProducto
        );


    guardarCarrito();

    renderizarCarrito();

}


/* =========================================
   RESUMEN
========================================= */

function actualizarResumenCarrito() {

    const cantidadTotal =
        carrito.reduce(
            (total, item) =>
                total +
                item.cantidad,
            0
        );


    const precioTotal =
        carrito.reduce(
            (total, item) =>
                total +
                (
                    item.precio *
                    item.cantidad
                ),
            0
        );


    cartCount.textContent =
        cantidadTotal;


    cartSubtotal.textContent =
        formatearMoneda(
            precioTotal
        );


    cartTotal.textContent =
        formatearMoneda(
            precioTotal
        );

}


/* =========================================
   LOCAL STORAGE
========================================= */

function obtenerCarrito() {

    try {

        const datos =
            localStorage.getItem(
                STORAGE_KEY
            );


        return datos
            ? JSON.parse(datos)
            : [];

    } catch (error) {

        console.error(
            "Error al cargar el carrito:",
            error
        );


        return [];

    }

}


function guardarCarrito() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(carrito)
    );

}


/* =========================================
   ABRIR Y CERRAR CARRITO
========================================= */

function abrirCarrito() {

    cartDrawer.classList.remove(
        "translate-x-full"
    );


    cartOverlay.classList.remove(
        "opacity-0",
        "invisible"
    );

}


function cerrarCarrito() {

    cartDrawer.classList.add(
        "translate-x-full"
    );


    cartOverlay.classList.add(
        "opacity-0",
        "invisible"
    );

}


/* =========================================
   FINALIZAR COMPRA
========================================= */

function finalizarCompra() {

    if (carrito.length === 0) {

        mostrarToast(
            "Tu carrito está vacío"
        );

        return;

    }


    mostrarToast(
        "Pedido realizado correctamente"
    );


    carrito = [];


    guardarCarrito();

    renderizarCarrito();


    setTimeout(
        cerrarCarrito,
        1000
    );

}


/* =========================================
   MONEDA
========================================= */

function formatearMoneda(
    valor
) {

    return (
        "Gs. " +
        valor.toLocaleString(
            "es-PY"
        )
    );

}


/* =========================================
   NOTIFICACIONES
========================================= */

let toastTimeout;


function mostrarToast(
    mensaje
) {

    clearTimeout(
        toastTimeout
    );


    toast.textContent =
        mensaje;


    toast.classList.remove(
        "opacity-0",
        "translate-y-4"
    );


    toast.classList.add(
        "opacity-100",
        "translate-y-0"
    );


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "opacity-100",
                    "translate-y-0"
                );


                toast.classList.add(
                    "opacity-0",
                    "translate-y-4"
                );

            },
            2300
        );

}