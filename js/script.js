const buscarInput = document.getElementById('buscarInput');
const btnBuscar = document.getElementById('btnBuscar');
const btnLimpiar = document.getElementById('btnLimpiar');
const contenedorMensajes = document.getElementById("message");
const contenedorDePersonajes = document.getElementById("Personaje");

let todosLosPersonajes = [];

// Mostrar mensaje
function showMessage(text) {
  contenedorMensajes.textContent = text;
}

// Limpiar pantalla
function LimpiarPersonaje() {
  contenedorDePersonajes.innerHTML = '';
  contenedorMensajes.textContent = '';
}

// Renderizar tarjetas
function renderTarjetas(personajes) {
  contenedorDePersonajes.innerHTML = ''; // limpiar antes de renderizar
  personajes.forEach(personaje => {
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('Tarjeta-Personaje', 'col-12', 'col-md-4', 'd-flex', 'align-items-stretch', 'justify-content-center');
    tarjeta.innerHTML = `
      <div class="card h-100 shadow-lg border-warning border-2">
        <img src="${personaje.image}" alt="${personaje.name}" class="card-img-top"/>
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <h3 class="card-title text-center mb-2" style="font-family: 'Luckiest Guy', cursive; color: #ff9800;">${personaje.name}</h3>
            <p class="card-text mb-1"><strong>Raza:</strong> ${personaje.race}</p>
            <p class="card-text mb-3"><strong>Género:</strong> ${personaje.gender}</p>
          </div>
          <button class="btn btn-warning mt-auto w-100 ver-detalles-btn" data-id="${personaje.id}">Ver detalles</button>
        </div>
      </div>
    `;
    contenedorDePersonajes.appendChild(tarjeta);
  });
}

// Obtener todos los personajes al inicio
async function cargarPersonajesInicio() {
  try {
    const respuesta = await fetch('https://dragonball-api.com/api/characters?page=1');
    const data = await respuesta.json();
    todosLosPersonajes = data.items;
    renderTarjetas(todosLosPersonajes.slice(0, 12)); // Mostrar primeros 12
  } catch {
    showMessage('Error al cargar personajes.');
  }
}

// Buscar localmente por nombre
function buscarLocalmente(nombre) {
  const nombreBuscado = nombre.toLowerCase();
  const personajesFiltrados = todosLosPersonajes.filter(p =>
    p.name.toLowerCase().includes(nombreBuscado)
  );

  if (personajesFiltrados.length === 0) {
    showMessage("No se encontraron personajes con ese nombre.");
  } else {
    renderTarjetas(personajesFiltrados);
  }
}

// Eventos
btnBuscar.addEventListener('click', () => {
  LimpiarPersonaje();
  const nombre = buscarInput.value.trim();
  if (!nombre) {
    showMessage('Por favor, ingrese un nombre para buscar.');
  } else {
    buscarLocalmente(nombre);
  }
});

btnLimpiar.addEventListener('click', () => {
  buscarInput.value = '';
  LimpiarPersonaje();
  renderTarjetas(todosLosPersonajes.slice(0, 12));
});

// Cargar al iniciar
window.addEventListener('DOMContentLoaded', cargarPersonajesInicio);