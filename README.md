# Pokemon - Ari

Aplicacion web responsiva hecha con Vue 3 y Tailwind CSS que consume la PokeAPI. Permite listar Pokemon con paginacion, buscar por nombre o ID y ver el detalle en un modal.

## Funcionalidades
- Listado paginado de Pokemon
- Busqueda por nombre o ID
- Modal con detalle (imagen, tipos, habilidades, altura y peso)
- Estados de carga y manejo de errores
- Diseno responsivo con estilo Pokemon

## Tecnologias
- Vue 3 (Vite)
- Tailwind CSS
- PokeAPI

## Requisitos
- Node.js 18+ (recomendado)

## Instalacion y uso
1. Instalar dependencias:
   npm install

2. Correr en desarrollo:
   npm run dev

3. Generar build de produccion:
   npm run build

4. Previsualizar build:
   npm run preview

## Estructura del proyecto
- `src/api/api_pokemon.js` -> llamadas a la PokeAPI
- `src/composables/usar_pokedex.js` -> estado y logica (paginacion, busqueda, cache, abort)
- `src/components/TarjetaPokemon.vue` -> tarjeta del listado
- `src/components/ModalPokemon.vue` -> modal de detalle
- `src/App.vue` -> layout principal y orquestacion de componentes

## Notas
- La PokeAPI es publica y no requiere autenticacion.
- Se usa AbortController para cancelar peticiones si el usuario cambia rapido de pagina o busqueda.

## Autor
Ari Gomez
