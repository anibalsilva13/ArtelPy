# ArtelPy

ArtelPy es un e-commerce frontend de artesanías paraguayas inspirado en la tradición artesanal de Carapeguá, conocida como la ciudad del poyvi.

El proyecto fue desarrollado como trabajo académico con el objetivo de aplicar conceptos de maquetación web, diseño responsive, interactividad con JavaScript, almacenamiento local y consumo de APIs externas.

## Sitio web

[Ver ArtelPy en GitHub Pages](https://anibalsilva13.github.io/ArtelPy/)

## Características

- Catálogo dinámico de productos artesanales.
- Filtros por categoría.
- Buscador de productos.
- Carrito de compras interactivo.
- Persistencia del carrito mediante LocalStorage.
- Control de cantidades y eliminación de productos.
- Simulación de finalización de compra.
- Formulario de contacto.
- Diseño responsive para escritorio y dispositivos móviles.
- Consumo de API meteorológica.
- Detección aproximada de ubicación del usuario.
- Visualización dinámica del clima según ubicación.
- Interfaz inspirada en la identidad visual de ArtelPy.

## Tecnologías utilizadas

- HTML5
- Tailwind CSS
- CSS3
- JavaScript
- LocalStorage
- Fetch API
- Open-Meteo API
- API de geolocalización por IP
- Git
- GitHub
- GitHub Pages
- Figma

## Consumo de APIs

ArtelPy incorpora información meteorológica dinámica.

La aplicación obtiene una ubicación aproximada del usuario y utiliza sus coordenadas para consultar las condiciones climáticas actuales mediante una API externa.

En caso de que no sea posible determinar la ubicación, el sistema utiliza Carapeguá como ubicación de respaldo.

Esta funcionalidad permite demostrar el uso de:

- Fetch API
- JSON
- async/await
- manejo de errores
- consumo de servicios externos

## Estructura del proyecto

```text
ArtelPy/
│
├── assets/
│   └── img/
│       ├── almohada.png
│       ├── hamaca.png
│       ├── logoartell.png
│       ├── ponchodama.png
│       ├── sobrecama.png
│       ├── sombrero.png
│       └── termoforr.png
│
├── index.html
├── styles.css
├── app.js
├── README.md
└── LICENSE