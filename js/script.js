window.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'https://dragonball-api.com/api/characters';
  const characterContainer = document.getElementById('characterContainer');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const messageDiv = document.getElementById('message');
  const spinner = document.getElementById('loadingSpinner');
  const backToTop = document.getElementById('backToTop');

  let currentPage = 1;
  let currentQuery = '';
  let loading = false;
  let totalPages = Infinity;

  function mostrarSpinner() {
    spinner.style.display = 'block';
  }
  function ocultarSpinner() {
    spinner.style.display = 'none';
  }
  function clearResults() {
    characterContainer.innerHTML = '';
    messageDiv.textContent = '';
  }
  function showMessage(msg, isError = true) {
    messageDiv.textContent = msg;
    messageDiv.style.color = isError ? 'red' : 'green';
  }
  function renderCharacters(characters) {
    characterContainer.innerHTML = '';
    if (characters.length === 0 && currentPage === 1) {
      showMessage('No se encontraron personajes.');
      return;
    }

    characters.forEach(char => {
      const col = document.createElement('div');
      col.className = 'col-12 col-md-4 mb-4';

      const card = document.createElement('div');
      card.className = 'card h-100';
      card.style.background = 'yellow'; // Para depuración visual

      const img = document.createElement('img');
      img.src = char.image || 'https://via.placeholder.com/150';
      img.alt = char.name || 'Personaje';
      img.className = 'card-img-top';

      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';

      const name = document.createElement('h5');
      name.className = 'card-title';
      name.textContent = char.name || 'Nombre desconocido';

      const race = document.createElement('p');
      race.textContent = `Raza: ${char.race || 'Desconocida'}`;

      const gender = document.createElement('p');
      gender.textContent = `Género: ${char.gender || 'Desconocido'}`;

      cardBody.appendChild(name);
      cardBody.appendChild(race);
      cardBody.appendChild(gender);

      card.appendChild(img);
      card.appendChild(cardBody);
      col.appendChild(card);
      characterContainer.appendChild(col);
    });
  }

  async function fetchCharacters(name = '', page = 1) {
    try {
      loading = true;
      mostrarSpinner();
      showMessage('Cargando...', false);

      let url = `${API_URL}?page=${page}`;
      if (name) url += `&name=${encodeURIComponent(name)}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error en la respuesta: ${response.status}`);

      const data = await response.json();
      if (data.meta && data.meta.totalPages) {
        totalPages = data.meta.totalPages;
      }

      loading = false;
      ocultarSpinner();
      showMessage('', false);
      return data.data || [];
    } catch (error) {
      loading = false;
      ocultarSpinner();
      showMessage(`Error al consultar la API: ${error.message}`);
      console.error('Error al consultar la API:', error);
      return [];
    }
  }
  
  characterContainer.innerHTML = `
  <div class="col-12 col-md-4 mb-4">
    <div class="card h-100" style="background: yellow;">
      <img src="https://via.placeholder.com/150" class="card-img-top" alt="Test">
      <div class="card-body">
        <h5 class="card-title">Test Personaje</h5>
        <p>Raza: Saiyan</p>
        <p>Género: Masculino</p>
      </div>
    </div>
  </div>
`;

  async function loadCharacters(reset = false) {
    if (loading) return;

    if (reset) {
      clearResults();
      currentPage = 1;
      totalPages = Infinity;
    }

    currentQuery = searchInput.value.trim();

    const characters = await fetchCharacters(currentQuery, currentPage);
    console.log(characters);

    if (characters.length === 0 && currentPage === 1) {
      showMessage('No se encontraron personajes.');
      return;
    }

    renderCharacters(characters);
  }

  searchButton.addEventListener('click', () => {
    currentPage = 1;
    loadCharacters(true);
  });

  window.addEventListener('scroll', () => {
    if (loading) return;
    if (currentPage >= totalPages) return;

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      currentPage++;
      loadCharacters(false);
    }

    if (scrollTop > 300) {
      backToTop.style.display = 'block';
    } else {
      backToTop.style.display = 'none';
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Inicialización al cargar la página
  searchInput.value = '';
  currentPage = 1;
  totalPages = Infinity;
  loadCharacters(true);
});