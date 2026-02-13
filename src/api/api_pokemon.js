const URL_BASE = "https://pokeapi.co/api/v2";

// Funcion generica para pedir JSON a la API con manejo de errores y soporte para cancelar la peticion
async function pedirJSON(ruta, signal) {
  const respuesta = await fetch(`${URL_BASE}${ruta}`, { signal });

  // Si la respuesta falla, intentamos leer el texto para dar un error mas claro
  if (!respuesta.ok) {
    const texto = await respuesta.text().catch(() => "");
    // Guardamos el status para manejar 404 de forma mas clara en la UI
    const err = new Error(`Error ${respuesta.status}: ${texto || respuesta.statusText}`);
    err.status = respuesta.status;
    throw err;
  }

  return respuesta.json();
}

// Obtiene la lista paginada de Pokemon (limit y offset controlan la pagina)
// Lista paginada: /pokemon?limit=20&offset=0

export function listarPokemon({ limite, offset }, signal) {
  const qs = new URLSearchParams({
    limit: String(limite),
    offset: String(offset),
  });

  return pedirJSON(`/pokemon?${qs.toString()}`, signal);
}

// Obtiene el detalle de un Pokemon por nombre o por id
// Detalle: /pokemon/{nombre_o_id}
export function obtenerPokemon(nombreOId, signal) {
  return pedirJSON(`/pokemon/${nombreOId}`, signal);
}
