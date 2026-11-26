# Galano Muebles — Frontend

Panel web de administración para la API REST de Galano Muebles. Permite consultar, crear, editar y eliminar productos, categorías, clientes, pedidos, detalles de pedido y pagos.

## Requisitos

- Node.js y PostgreSQL configurados para el backend.
- La API del backend iniciada (por defecto, `http://localhost:3000`).

## Uso

1. Iniciá PostgreSQL y el backend desde su propia carpeta:

   ```bash
   npm install
   npm run dev
   ```

2. Abrí `index.html` con un servidor estático, por ejemplo con la extensión **Live Server** de VS Code. El panel se conecta por defecto a `http://localhost:3000/api`.
3. Si la API usa otra dirección, seleccioná el engranaje en la esquina inferior izquierda y guardá la URL completa, terminada en `/api`. La dirección queda guardada en el navegador.

La API del backend habilita CORS. Los errores que devuelve el servidor se muestran en el panel para facilitar su diagnóstico.

## Estructura

```text
gallano1_frontend/
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── index.html
└── README.md
```
