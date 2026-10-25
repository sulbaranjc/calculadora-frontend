const API_URL = 'http://localhost:8081/c';

// Elementos del formulario, obtenidos por su id.
const formulario = document.getElementById('calculator-form');
const entradaA = document.getElementById('number-a');
const entradaB = document.getElementById('number-b');
const operacion = document.getElementById('operation');
const boton = document.getElementById('calculate-button');
const resultado = document.getElementById('result');
const mensaje = document.getElementById('feedback');

formulario.addEventListener('submit', manejarEnvio);

// Valida los datos y muestra el resultado que devuelve la API.
async function manejarEnvio(evento) {
  evento.preventDefault();
  mensaje.textContent = '';

  if (entradaA.value === '' || entradaB.value === '') {
    mostrarError('Escribe los dos números.');
    return;
  }

  const a = Number(entradaA.value);
  const b = Number(entradaB.value);

  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    mostrarError('Introduce números válidos.');
    return;
  }

  boton.disabled = true;
  try {
    resultado.textContent = String(await calcularEnApi(a, b, operacion.value));
  } catch (error) {
    mostrarError(error.message);
  } finally {
    boton.disabled = false;
  }
}

// Envía GET /c y comprueba la respuesta según el contrato del backend.
async function calcularEnApi(a, b, operacion) {
  const parametros = new URLSearchParams({ a: String(a), b: String(b), operacion });
  let respuesta;

  try {
    respuesta = await fetch(`${API_URL}?${parametros}`);
  } catch {
    throw new Error('No se pudo conectar con el backend.');
  }

  if (respuesta.status === 400) {
    let error = 'Datos no válidos.';
    try {
      const datos = await respuesta.json();
      if (typeof datos?.error === 'string') error = datos.error;
    } catch {
      // Conservamos el mensaje general si el error no contiene JSON.
    }
    throw new Error(error);
  }

  if (!respuesta.ok) {
    throw new Error(`Error del servidor (${respuesta.status}).`);
  }

  let datos;
  try {
    datos = await respuesta.json();
  } catch {
    throw new Error('Respuesta no válida del servidor.');
  }

  // Un desbordamiento puede llegar como el texto "Infinity".
  if (typeof datos?.resultado !== 'number' || !Number.isFinite(datos.resultado)) {
    throw new Error('El resultado está fuera de rango.');
  }

  return datos.resultado;
}

// Muestra el error y borra el resultado anterior.
function mostrarError(texto) {
  mensaje.textContent = texto;
  resultado.textContent = '—';
}
