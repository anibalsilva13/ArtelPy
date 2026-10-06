# 🛒 ArtelPy

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-Frontend-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/Tailwind_CSS-Estilos-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/JavaScript-ES_Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Open--Meteo-API-4285F4?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Open-Meteo API">
  <img src="https://img.shields.io/badge/LocalStorage-Persistencia-D2A63A?style=for-the-badge&logo=databricks&logoColor=white" alt="LocalStorage">
  <img src="https://img.shields.io/badge/GitHub_Pages-Deploy-222222?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Pages">
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