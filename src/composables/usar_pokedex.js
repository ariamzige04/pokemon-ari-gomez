import { computed, ref, watch } from "vue";
import { listarPokemon, obtenerPokemon } from "../api/api_pokemon";

// Util simple para mostrar nombres bonitos en la UI
export function capitalizar(texto = "") {
  const t = String(texto);
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export function usarPokedex() {
  // Paginacion: limit y offset controlan la pagina actual
  const limite = ref(20);
  const offset = ref(0);

  // Estados para la UI (spinners, mensajes, etc.)
  const cargandoLista = ref(false);
  const cargandoDetalle = ref(false);
  const error = ref(null);

  // Mensaje para validar el input de busqueda (cuando esta vacio)
  const errorBusqueda = ref("");

  // Datos principales del listado
  const items = ref([]);
  const total = ref(0);

  // Busqueda y pokemon seleccionado (para el modal)
  const busqueda = ref("");
  const pokemonSeleccionado = ref(null);

  // Cache simple para evitar pedir el mismo pokemon varias veces
  const cache = new Map();

  // AbortController para cancelar peticiones anteriores si el usuario cambia rapido
  let abortLista = null;
  let abortDetalle = null;

  const pagina = computed(() => Math.floor(offset.value / limite.value) + 1);
  const totalPaginas = computed(() => Math.max(1, Math.ceil(total.value / limite.value)));

  // Limpia el mensaje cuando el usuario empieza a escribir
  watch(busqueda, (val) => {
    if (String(val || "").trim().length > 0) {
      errorBusqueda.value = "";
    }
  });

  // Carga la lista paginada (usa abort para evitar respuestas viejas)
  async function cargarLista() {
    try {
      error.value = null;
      cargandoLista.value = true;

      abortLista?.abort();
      abortLista = new AbortController();

      const data = await listarPokemon(
        { limite: limite.value, offset: offset.value },
        abortLista.signal
      );

      items.value = data.results || [];
      total.value = data.count || 0;
    } catch (e) {
      if (e?.name !== "AbortError") {
        error.value = e?.message || "Ocurrio un error al cargar la lista.";
      }
    } finally {
      cargandoLista.value = false;
    }
  }

  // Avanza una pagina y recarga la lista
  function siguientePagina() {
    if (offset.value + limite.value < total.value) {
      offset.value += limite.value;
      cargarLista();
    }
  }

  // Retrocede una pagina y recarga la lista
  function paginaAnterior() {
    if (offset.value - limite.value >= 0) {
      offset.value -= limite.value;
      cargarLista();
    }
  }

  // Abre el detalle por nombre o id (con cache y abort)
  async function abrirPokemon(nombreOId) {
    const clave = String(nombreOId).trim().toLowerCase();
    if (!clave) return;

    // Si ya lo tenemos en cache, evitamos otra llamada a la API
    if (cache.has(clave)) {
      pokemonSeleccionado.value = cache.get(clave);
      return;
    }

    try {
      error.value = null;
      cargandoDetalle.value = true;

      abortDetalle?.abort();
      abortDetalle = new AbortController();

      const data = await obtenerPokemon(clave, abortDetalle.signal);

      // Guardamos varias llaves para encontrarlo por id o nombre despues
      cache.set(clave, data);
      cache.set(String(data.id), data);
      cache.set(String(data.name).toLowerCase(), data);

      pokemonSeleccionado.value = data;
    } catch (e) {
      if (e?.name !== "AbortError") {
        error.value = e?.message || "No se pudo cargar el Pokemon.";
      }
    } finally {
      cargandoDetalle.value = false;
    }
  }

  // Busca y abre un pokemon usando el texto del input
  async function buscarPokemon() {
    const q = busqueda.value.trim().toLowerCase();

    // Validacion: si esta vacio mostramos alerta
    if (!q) {
      errorBusqueda.value = "Escribe un nombre o ID para buscar.";
      return;
    }

    // Si ya hay texto, limpiamos la alerta
    errorBusqueda.value = "";

    await abrirPokemon(q);
  }

  // Cierra el modal limpiando el seleccionado
  function cerrarModal() {
    pokemonSeleccionado.value = null;
  }

  return {
    // state
    limite,
    offset,
    pagina,
    totalPaginas,
    total,
    items,
    busqueda,
    pokemonSeleccionado,
    cargandoLista,
    cargandoDetalle,
    error,
    errorBusqueda,

    // acciones
    cargarLista,
    siguientePagina,
    paginaAnterior,
    abrirPokemon,
    buscarPokemon,
    cerrarModal,

    // util
    capitalizar,
  };
}