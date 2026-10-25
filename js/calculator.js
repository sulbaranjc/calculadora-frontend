// Versión local: calcula sin consultar el backend.
const formulario = document.getElementById('calculator-form');
const entradaA = document.getElementById('number-a');
const entradaB = document.getElementById('number-b');
const operacion = document.getElementById('operation');
const resultado = document.getElementById('result');
const mensaje = document.getElementById('feedback');

formulario.addEventListener('submit', manejarEnvio);

// Valida el formulario, calcula y muestra el resultado.
function manejarEnvio(evento) {
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

  if (operacion.value === 'division' && b === 0) {
    mostrarError('No se puede dividir entre cero.');
    return;
  }

  let calculo;
  switch (operacion.value) {
    case 'suma': calculo = a + b; break;
    case 'resta': calculo = a - b; break;
    case 'multiplicacion': calculo = a * b; break;
    case 'division': calculo = a / b; break;
    default: mostrarError('Operación no válida.'); return;
  }

  if (!Number.isFinite(calculo)) {
    mostrarError('El resultado está fuera de rango.');
    return;
  }

  resultado.textContent = String(calculo);
}

// Muestra el error y borra el resultado anterior.
function mostrarError(texto) {
  mensaje.textContent = texto;
  resultado.textContent = '—';
}
