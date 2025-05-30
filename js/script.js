const characterContainer = document.getElementById('characterContainer');
const searchInput = document.getElementById('searchInput');
const messageDiv = document.getElementById('message');
const searchButton = document.getElementById('searchButton');

let currentPage = 1;
let currentQuery = '';
let loading = false;       
let totalPages = Infinity; 

function clearResults() {
  characterContainer.innerHTML = '';
  messageDiv.textContent = '';
  currentPage = 1;
  totalPages = Infinity;