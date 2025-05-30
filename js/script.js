const buscarInput = document.querySelector('input[placeholder="Buscar personajes"]'); // input de búsqueda
const btnBuscar = document.querySelector(".btn.btn-warning");
const btnLimpiar = document.querySelector(".btn.btn-success");
const contenedorMensajes = document.getElementById("message");
const contenedorDePersonajes = document.getElementById("Personaje"); 

let PersonajesArray = [];

function LimpiarPersonaje() {
  contenedorDePersonajes.innerHTML = '';
  contenedorMensajes.textContent = '';
}

function showMessage(text) {
  contenedorMensajes.textContent = text;
}

function renderTarjetas(personajes) {
  contenedorDePersonajes.innerHTML = ''; 
  personajes.forEach(personaje => {
    const Tarjeta = document.createElement('div');
    Tarjeta.classList.add('Tarjeta-Personaje', 'col-12', 'col-md-4', 'd-flex', 'align-items-stretch', 'justify-content-center');
    Tarjeta.innerHTML = `
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
    contenedorDePersonajes.appendChild(Tarjeta);
  });

  document.querySelectorAll('.ver-detalles-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      alert('Aquí puedes mostrar detalles del personaje con id: ' + id);
    });
  });
}

async function buscarPersonajesByName(name) {
  try {
    showMessage(''); 
    contenedorDePersonajes.innerHTML = ''; 
    const respuesta = await fetch(`https://dragonball-api.com/api/characters?name=${encodeURIComponent(name)}`);
    if (!respuesta.ok) {
      throw new Error(`Error al consultar la API. Código: ${respuesta.status}`);
    }
    const data = await respuesta.json();

    // La API puede devolver los personajes en data.items o data
    const personajes = data.items || data;
    if (!personajes || personajes.length === 0) {
      showMessage('No se encontraron personajes con ese nombre.');
      return;
    }
    PersonajesArray = personajes;
    renderTarjetas(PersonajesArray);
  } catch (error) {
    console.error('Error de red o fetch:', error);
    showMessage('Ocurrió un error al consultar la API. Por favor, intentá de nuevo más tarde.');
  }
}

// Cargar personajes al inicio (primeros 12)
async function cargarPersonajesInicio() {
  LimpiarPersonaje();
  try {
    const respuesta = await fetch('https://dragonball-api.com/api/characters?page=1');
    if (!respuesta.ok) throw new Error();
    const data = await respuesta.json();
    const personajes = data.items || data;
    if (!personajes || personajes.length === 0) {
      showMessage('No se encontraron personajes.');
      return;
    }
    renderTarjetas(personajes.slice(0, 12)); 
  } catch {
    showMessage('Error al cargar personajes.');
  }
}


btnBuscar.addEventListener('click', (e) => {
  e.preventDefault();
  LimpiarPersonaje();
  const query = buscarInput.value.trim();
  if (!query) {
    showMessage('Por favor, ingrese un nombre para buscar.');
    return;
  }
  buscarPersonajesByName(query);
});

// Evento limpiar
btnLimpiar.addEventListener('click', () => {
  buscarInput.value = '';
  LimpiarPersonaje();
  cargarPersonajesInicio();
});

// Cargar personajes al abrir la página
window.addEventListener('DOMContentLoaded', cargarPersonajesInicio);