// El dinamismo en las páginas web se lo debemos a JS entre otros.

//Control de la url a la cual hacemos la petición.
const apiURL = 'https://restcountries.com/v3.1/all';

//Elegimos el número de países que queremos por página y la página en la que arrancamos. También declaramos una variable del total de páginas y otra que acogerá a los países.
const perPage = 10;
let currentPage = 1;
let totalPages;
let countriesData;

async function fetchData() {
    const response = await fetch(apiURL);
    countriesData = await response.json();
    return countriesData;
}

//Función que renderiza las líneas que vemos en la tabla.
async function renderData(page) {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const dataSlice = countriesData.slice(start, end);

    const dataBody = document.getElementById('dataBody');
    dataBody.innerHTML = '';

    dataSlice.forEach(item => {
        const row = `<tr>
                        <td>${item.cca2}</td>
                        <td>${item.name.common}</td>
                        <td>${item.capital ? item.capital[0] : 'N/A'}</td>
                        <td>${item.region}</td>
                        <td>${item.subregion}</td>
                    </tr>`;
        dataBody.innerHTML += row;
    });
}

//Función que renderiza la paginación que estamos viendo.
async function renderPagination() {
    const totalItems = countriesData.length;
    totalPages = Math.ceil(totalItems / perPage);

    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.classList.add('page-item');
        li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
        pagination.appendChild(li);
    }
}

function changePage(page) {
    currentPage = page;
    renderData(currentPage);
    setActivePage();
}

function setActivePage() {
    const pages = document.querySelectorAll('.page-item');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    const currentPageItem = document.querySelector(`.page-item:nth-child(${currentPage + 1})`);
    currentPageItem.classList.add('active');
}

//Función para filtrar a los países.
function filterCountries() {
    const filterValue = document.getElementById('countryFilter').value.toLowerCase();
    const filteredData = countriesData.filter(country =>
        country.name.common.toLowerCase().includes(filterValue)
    );
    renderFilteredData(filteredData);
}

//Función para controlar el filtrado de los países y la renderización posterior de la información.
function renderFilteredData(filteredData) {
    const dataBody = document.getElementById('dataBody');
    dataBody.innerHTML = '';

    filteredData.forEach(item => {
        const row = `<tr>
                        <td>${item.cca2}</td>
                        <td>${item.name.common}</td>
                        <td>${item.capital ? item.capital[0] : 'N/A'}</td>
                        <td>${item.region}</td>
                        <td>${item.subregion}</td>
                    </tr>`;
        dataBody.innerHTML += row;
    });

    renderPagination();
}

(async function () {
    await fetchData();
    await renderData(currentPage);
    await renderPagination();
})();

document.getElementById('countryFilter').addEventListener('input', filterCountries);