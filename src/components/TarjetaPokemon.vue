<script setup>
import { capitalizar } from "../composables/usar_pokedex";

// Recibe un item del listado de la API (name, url)
const props = defineProps({
  item: { type: Object, required: true },
});

// Evento para avisar al padre que se dio click y abrir el detalle
const emit = defineEmits(["abrir"]);

// Extrae el id desde la URL que trae la API (ej: .../pokemon/25/)
function obtenerIdDesdeUrl(url = "") {
  const partes = String(url).split("/").filter(Boolean);
  return partes[partes.length - 1] || "";
}
</script>

<template>
  <!-- Boton completo como tarjeta: al hacer click emitimos el nombre para abrir el modal -->
  <button
    type="button"
    class="group w-full rounded-2xl border border-black/10 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    @click="emit('abrir', props.item.name)"
  >
    <div class="flex items-center justify-between">
      <span class="rounded-full bg-pokemon-amarillo px-3 py-1 text-xs font-semibold text-black">
        #{{ obtenerIdDesdeUrl(props.item.url) }}
      </span>

      <span class="text-xs text-black/50 group-hover:text-black/70">Ver detalle</span>
    </div>

    <div class="mt-3 text-lg font-bold text-black">
      {{ capitalizar(props.item.name) }}
    </div>

    <div class="mt-1 text-sm text-black/60">
      Toca para ver tipos, habilidades e imagen
    </div>
  </button>
</template>
