<script setup>
import { computed, onMounted } from "vue";
import { usarPokedex, capitalizar } from "./composables/usar_pokedex";
import TarjetaPokemon from "./components/TarjetaPokemon.vue";
import ModalPokemon from "./components/ModalPokemon.vue";
import logoPokemon from "./assets/pokemon-logo.png";

// Estado principal de la app (lista, paginacion, busqueda y pokemon seleccionado)
const p = usarPokedex();

// El modal esta abierto si existe un pokemon seleccionado
const modalAbierto = computed(() => !!p.pokemonSeleccionado.value);

// Carga la primera pagina al iniciar la aplicacion
onMounted(() => {
  p.cargarLista();
});

// Recibe el nombre desde la tarjeta y abre el detalle
function abrirDesdeTarjeta(nombre) {
  p.abrirPokemon(nombre);
}
</script>

<template>
  <div class="min-h-screen" style="background:#3763AD;">
    <header class="mx-auto max-w-6xl px-4 pt-6">
      <div class="rounded-3xl bg-white/95 p-4 shadow-xl ring-1 ring-black/10">
        <div class="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div class="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <img
              class="h-12 w-auto"
              :src="logoPokemon"
              alt="Pokémon"
            />
            <div>
              <h1 class="text-3xl text-black [font-family:var(--font-pokemon)]">
                Aplicación de Pokémon en Vue 3 con Tailwind
              </h1>
              <p class="text-sm text-black/60">
                Lista con paginación, búsqueda por nombre o ID, vista de detalle en modal, manejo de carga/errores.
              </p>
            </div>
          </div>

          <!-- Busqueda: enter o boton para abrir el pokemon por nombre o id -->
          <div class="flex w-full flex-col gap-2 md:w-auto md:flex-row">
            <input
              v-model="p.busqueda.value"
              class="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-pokemon-amarillo focus:ring-4 focus:ring-pokemon-amarillo/30 md:w-80"
              placeholder="Buscar por nombre o ID (ej. pikachu o 25)"
              @keydown.enter="p.buscarPokemon"
            />
            <button
              class="rounded-2xl bg-pokemon-amarillo px-5 py-3 text-sm font-extrabold text-black hover:brightness-95"
              type="button"
              @click="p.buscarPokemon"
            >
              Buscar
            </button>
          </div>
        </div>

        <div
          v-if="p.errorBusqueda && p.errorBusqueda.value"
          class="mt-2 rounded-2xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-800 ring-1 ring-red-200"
        >
          {{ p.errorBusqueda.value }}
        </div>

        <!-- Paginacion superior y numero de pagina -->
        <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="text-sm font-semibold text-black/70">
            <span v-if="p.cargandoLista.value" class="inline-flex items-center gap-2">
              <span class="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black"></span>
              Cargando lista…
            </span>
            <span v-else> Página {{ p.pagina.value }} de {{ p.totalPaginas.value }} </span>
          </div>

          <div class="flex gap-2">
            <button
              class="rounded-2xl bg-white px-4 py-2 text-sm font-bold text-black ring-1 ring-black/10 hover:bg-black/5 disabled:opacity-50"
              type="button"
              @click="p.paginaAnterior"
              :disabled="p.offset.value === 0"
            >
              Anterior
            </button>
            <button
              class="rounded-2xl px-4 py-2 text-sm font-extrabold text-white hover:brightness-95 disabled:opacity-50"
              style="background:#3763AD;"
              type="button"
              @click="p.siguientePagina"
              :disabled="p.pagina.value >= p.totalPaginas.value"
            >
              Siguiente
            </button>
          </div>
        </div>

        <!-- Mensaje de error global (API, red, etc.) -->
        <div
          v-if="p.error.value"
          class="mt-4 rounded-2xl bg-red-100 p-3 text-sm font-semibold text-red-800 ring-1 ring-red-200"
        >
          {{ p.error.value }}
        </div>

        <!-- Mensaje vacio para busqueda sin resultados (404) -->
        <div
          v-if="p.mensajeVacio && p.mensajeVacio.value"
          class="mt-4 rounded-2xl bg-yellow-100 p-3 text-sm font-semibold text-yellow-900 ring-1 ring-yellow-200"
        >
          {{ p.mensajeVacio.value }}
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-6">
      <!-- Grid de tarjetas, cada una abre el modal con el detalle -->
      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TarjetaPokemon
          v-for="it in p.items.value"
          :key="it.name"
          :item="it"
          @abrir="abrirDesdeTarjeta"
        />
      </section>

      <!-- Paginacion inferior para no tener que subir cuando estas al final -->
      <div class="mt-8 flex items-center justify-center gap-2">
        <button
          class="rounded-2xl border border-white/60 bg-transparent px-4 py-2 text-sm font-bold text-white hover:bg-white/10 disabled:opacity-40"
          type="button"
          @click="p.paginaAnterior"
          :disabled="p.offset.value === 0"
        >
          Anterior
        </button>

        <button
          class="rounded-2xl bg-pokemon-amarillo px-4 py-2 text-sm font-extrabold text-black hover:brightness-95 disabled:opacity-40"
          type="button"
          @click="p.siguientePagina"
          :disabled="p.pagina.value >= p.totalPaginas.value"
        >
          Siguiente
        </button>
      </div>

      <!-- Estado vacio de la lista -->
      <p
        v-if="!p.cargandoLista.value && p.items.value.length === 0"
        class="mt-6 text-center text-sm font-semibold text-white/90"
      >
        No hay resultados.
      </p>
    </main>

    <!-- Modal controlado por pokemonSeleccionado (se cierra con update:modelValue) -->
    <ModalPokemon
      :model-value="modalAbierto"
      :pokemon="p.pokemonSeleccionado.value"
      :cargando="p.cargandoDetalle.value"
      @update:modelValue="p.cerrarModal"
    />
  </div>
</template>