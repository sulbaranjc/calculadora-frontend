const form = document.querySelector('#calculator-form');
const numberAInput = document.querySelector('#number-a');
const numberBInput = document.querySelector('#number-b');
const operationInput = document.querySelector('#operation');
const resultOutput = document.querySelector('#result');
const resultHint = document.querySelector('#result-hint');
const feedback = document.querySelector('#feedback');

const operations = {
  add: { symbol: '+', calculate: (a, b) => a + b },
  subtract: { symbol: '−', calculate: (a, b) => a - b },
  multiply: { symbol: '×', calculate: (a, b) => a * b },
  divide: { symbol: '÷', calculate: (a, b) => a / b },
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  feedback.textContent = '';

  const rawA = numberAInput.value.trim();
  const rawB = numberBInput.value.trim();

  if (rawA === '' || rawB === '') {
    showError('Escribe los dos números para poder calcular.');
    (rawA === '' ? numberAInput : numberBInput).focus();
    return;
  }

  const a = Number(rawA);
  const b = Number(rawB);
  const operation = operations[operationInput.value];

  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    showError('Introduce números válidos para continuar.');
    return;
  }

  if (operationInput.value === 'divide' && b === 0) {
    showError('No se puede dividir entre cero. Prueba con otro valor para B.');
    numberBInput.focus();
    return;
  }

  const result = operation.calculate(a, b);
  if (!Number.isFinite(result)) {
    showError('El resultado no se puede representar con estos valores.');
    return;
  }

  resultOutput.textContent = new Intl.NumberFormat('es-ES', {
    maximumFractionDigits: 10,
  }).format(result);
  resultHint.textContent = `${formatNumber(a)} ${operation.symbol} ${formatNumber(b)}`;
});

function showError(message) {
  feedback.textContent = message;
  resultOutput.textContent = '—';
  resultHint.textContent = 'Revisa los datos e inténtalo de nuevo';
}

function formatNumber(value) {
  return new Intl.NumberFormat('es-ES', { maximumFractionDigits: 10 }).format(value);
}