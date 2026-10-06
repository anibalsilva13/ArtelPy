# 🛒 ArtelPy

<p>
  <img src="https://cdn.simpleicons.org/html5/E34F26" width="16" alt="HTML5"> HTML5 &nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" width="16" alt="Tailwind CSS"> Tailwind CSS &nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/javascript/F7DF1E" width="16" alt="JavaScript"> JavaScript &nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/nodedotjs/8CC84B" width="16" alt="ES Modules"> ES Modules &nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/openweathermap/4285F4" width="16" alt="Open-Meteo API"> Open-Meteo API &nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/googlecloud/F4B400" width="16" alt="LocalStorage"> LocalStorage &nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/github/FFFFFF" width="16" alt="GitHub Pages"> GitHub Pages
</p>


ArtelPy es un proyecto de e-commerce frontend enfocado en artesanías paraguayas, inspirado en la identidad de Carapeguá y en la tradición del poyvi.

La idea fue crear una tienda digital con una estética moderna, pero sin perder el vínculo con lo artesanal. Por eso el diseño combina tonos oscuros, dorados y crema, buscando una imagen sobria y elegante que acompañe bien a los productos.

Este proyecto fue desarrollado como trabajo final académico y fue evolucionando desde una propuesta inicial en Figma hasta una versión funcional publicada en GitHub Pages.

## Sitio web

Podés ver el proyecto online en:

[https://anibalsilva13.github.io/ArtelPy/](https://anibalsilva13.github.io/ArtelPy/)

## Desarrollo

El trabajo comenzó con la definición de la identidad visual y la organización de las principales secciones del sitio en Figma.

Después se pasó a la implementación en código utilizando HTML, Tailwind CSS, CSS personalizado y JavaScript. A medida que el proyecto fue creciendo, se fueron agregando funcionalidades como el catálogo dinámico, filtros por categoría, búsqueda de productos, carrito de compras, almacenamiento local y consumo de APIs.

También se realizó una refactorización del código JavaScript para separar responsabilidades y evitar concentrar toda la lógica en un único archivo.

La intención fue mantener una estructura clara y fácil de continuar, tanto para corregir errores como para agregar nuevas funcionalidades más adelante.

## Funcionalidades principales

ArtelPy cuenta con un catálogo dinámico de productos, buscador, filtros por categoría y un carrito de compras donde se pueden agregar, aumentar, disminuir o eliminar productos.

El carrito mantiene la información mediante LocalStorage, por lo que los productos seleccionados permanecen incluso después de actualizar la página.

También se incorporó un formulario de contacto, notificaciones visuales y una simulación de finalización de compra.

Como parte del consumo de APIs, el sitio obtiene una ubicación aproximada del usuario y consulta el clima actual. Si la ubicación no puede ser detectada, se utiliza Carapeguá como referencia.

## Tecnologías utilizadas

El proyecto fue desarrollado principalmente con **HTML5, CSS3, Tailwind CSS y JavaScript**.

También se utilizaron **ES Modules, LocalStorage, Fetch API, Open-Meteo, Git, GitHub, GitHub Pages, Figma y Visual Studio Code**.

## Estructura del proyecto

```text
ArtelPy/
├── assets/
│   └── img/
│
├── js/
│   ├── app.js
│   ├── products.js
│   ├── storage.js
│   ├── ui.js
│   └── weather.js
│
├── index.html
├── styles.css
├── README.md
└── LICENSE