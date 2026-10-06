export const PRODUCTS = [
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

const productMap = new Map(
    PRODUCTS.map((product) => [
        product.id,
        product
    ])
);

export function getProductById(id) {
    return productMap.get(id);
}

export function hasProduct(id) {
    return productMap.has(id);
}

export function filterProducts(
    category,
    search = ""
) {
    const query = normalizeText(search);

    return PRODUCTS.filter((product) => {
        const matchesCategory =
            category === "Todos" ||
            product.categoria === category;

        if (!matchesCategory) {
            return false;
        }

        if (!query) {
            return true;
        }

        const searchableText =
            normalizeText(
                `${product.nombre} ${product.categoria} ${product.descripcion}`
            );

        return searchableText.includes(query);
    });
}

function normalizeText(value) {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}