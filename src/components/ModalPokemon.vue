<script setup>
import { computed } from "vue";
import { capitalizar } from "../composables/usar_pokedex";

// Props controlan el estado del modal y el contenido a mostrar
// - modelValue: abre/cierra el modal
// - pokemon: objeto con el detalle del pokemon seleccionado
// - cargando: muestra estado de carga mientras llega la info
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  pokemon: { type: Object, default: null },
  cargando: { type: Boolean, default: false },
});

// Emit para notificar al padre que cierre el modal (v-model)
const emit = defineEmits(["update:modelValue"]);

// Cierra el modal avisando al componente padre
function cerrar() {
  emit("update:modelValue", false);
}

// Nombre formateado para mostrar en el encabezado
const nombreBonito = computed(() =>
  props.pokemon?.name ? capitalizar(props.pokemon.name) : ""
);
</script>

<template>
  <!-- Overlay: click fuera del contenido cierra el modal -->
  <div
    v-if="props.modelValue"
    class="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
    @click.self="cerrar"
  >
    <div class="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
      <header class="flex items-center justify-between border-b border-black/10 p-4">
        <h2 class="text-xl font-bold text-black">
          {{ props.cargando ? "Cargando..." : nombreBonito }}
        </h2>

        <button
          class="rounded-xl px-3 py-2 text-sm font-semibold text-black/70 hover:bg-black/5"
          type="button"
          @click="cerrar"
        >
          Cerrar ✕
        </button>
      </header>

      <!-- Estado de carga -->
      <div v-if="props.cargando" class="p-6 text-black/60">
        Cargando información del Pokémon...
      </div>

      <!-- Contenido cuando ya existe el pokemon -->
      <div v-else-if="props.pokemon" class="p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="grid place-items-center rounded-2xl bg-black/5 p-4 sm:w-40">
            <img
              v-if="props.pokemon?.sprites?.front_default"
              :src="props.pokemon.sprites.front_default"
              :alt="props.pokemon.name"
              class="h-28 w-28"
            />
            <div v-else class="text-sm text-black/50">Sin imagen</div>
          </div>

          <div class="flex-1 space-y-2">
            <div class="text-sm text-black/70">
              <span class="font-semibold">ID:</span> {{ props.pokemon.id }}
            </div>
            <div class="text-sm text-black/70">
              <span class="font-semibold">Altura:</span> {{ props.pokemon.height }}
            </div>
            <div class="text-sm text-black/70">
              <span class="font-semibold">Peso:</span> {{ props.pokemon.weight }}
            </div>

            <div class="pt-2">
              <div class="text-sm font-bold text-black">Tipos</div>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="t in props.pokemon.types"
                  :key="t.type.name"
                  class="rounded-full bg-pokemon-azul px-3 py-1 text-xs font-semibold text-white"
                >
                  {{ capitalizar(t.type.name) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <div class="text-sm font-bold text-black">Habilidades</div>
          <ul class="mt-2 list-inside list-disc text-sm text-black/70">
            <li v-for="a in props.pokemon.abilities" :key="a.ability.name">
              {{ capitalizar(a.ability.name) }}
            </li>
          </ul>
        </div>
      </div>

      <footer class="border-t border-black/10 p-4">
        <button
          class="w-full rounded-2xl bg-pokemon-amarillo px-4 py-3 font-extrabold text-black hover:brightness-95"
          type="button"
          @click="cerrar"
        >
          ¡Listo!
        </button>
      </footer>
    </div>
  </div>
</template>
