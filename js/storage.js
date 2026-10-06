const STORAGE_KEY = "artelpy_carrito";

export function loadCart(isValidProduct) {
    try {
        const storedData =
            localStorage.getItem(STORAGE_KEY);

        if (!storedData) {
            return [];
        }

        const cart = JSON.parse(storedData);

        if (!Array.isArray(cart)) {
            return [];
        }

        return cart.filter(
            (item) =>
                Number.isInteger(item.id) &&
                Number.isInteger(item.cantidad) &&
                item.cantidad > 0 &&
                isValidProduct(item.id)
        );
    } catch (error) {
        console.error(
            "No se pudo cargar el carrito:",
            error
        );

        return [];
    }
}

export function saveCart(cart) {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(cart)
        );
    } catch (error) {
        console.error(
            "No se pudo guardar el carrito:",
            error
        );
    }
}