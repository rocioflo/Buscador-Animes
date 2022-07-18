'use strict';

//global variables
const input = document.querySelector('.js_input');
const submitBtn = document.querySelector('.js_submit_Btn');
const resetBtn = document.querySelector('.js_reset_Btn');
const resultsList = document.querySelector('.js_results_list');
const favoritesList = document.querySelector('.js_favorites_list');
const apiURL = 'https://api.jikan.moe/v4/anime?q=';
const noImage =
  'https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png';
const placeholderImage =
  'https://via.placeholder.com/225x200/ffffff/666666/?text=sin%20imagen%20%20:(';

//petition to server

let animes = [];

function handleInput(ev) {
  ev.preventDefault();
  animes = [];
  resultsList.innerHTML = 'Cargando...';
  const userInput = input.value.toLowerCase();

  fetch(`${apiURL}${userInput}`)
    .then((response) => response.json())
    .then((data) => {
      animes = data.data;
      console.log(animes);
      renderAnime();
    });
}

//image painter
function renderAnime() {
  resultsList.innerHTML = '';
  for (const item of animes) {
    if (item.images.jpg.image_url === noImage) {
      resultsList.innerHTML += `
        <li id="${item.mal_id}" class="list-item js_list_item">
          ${item.title} 
          <img class="anime-image" src="${placeholderImage}">
        </li>`;
    } else {
      resultsList.innerHTML += `
      <li id="${item.mal_id}" class="list-item js_list_item">
        ${item.title} 
        <img class="anime-image" src="${item.images.jpg.image_url}">
      </li>`;
    }
  }
  listenerAnimes();

  console.log(animeFavs);
}

submitBtn.addEventListener('click', handleInput);

//favs
let animeFavs = [];

function handleClick(event) {
  const animeId = parseInt(event.currentTarget.id);

  const favFound = animes.find((anime) => anime.mal_id === animeId);
  const animeIndexFound = animeFavs.findIndex(
    (anime) => anime.mal_id === animeId
  );

  if (animeIndexFound === -1) {
    animeFavs.push(favFound);
    // event.currentTarget.classList.add('other-background');
    // event.currentTarget.classList.add('font-fav');
  } else {
    animeFavs.splice(animeIndexFound, 1);
  }

  renderFavorites();
  favStorage();
}

function renderFavorites() {
  favoritesList.innerHTML = '';

  for (const favAnime of animeFavs) {
    favoritesList.innerHTML += `
  <li id="${favAnime.mal_id}" class="fav-list-item js_fav_list_item"></i>
    ${favAnime.title} 
    <img class="anime-image" src="${favAnime.images.jpg.image_url}">
  </li>`;
  }
  renderAnime();
  listenerFavAnimes();
}

function listenerAnimes() {
  const animeList = document.querySelectorAll('.js_list_item');

  for (const li of animeList) {
    li.addEventListener('click', handleClick);
  }
}

// fav bonus

// function handleFavClick(event) {
//   const favId = parseInt(event.currentTarget.id);
//   const favIndex = animeFavs.findIndex((fav) => fav.mal_id === favId);

//   console.log(favId);
//   console.log(favIndex);

//   animeFavs.splice(favIndex, 1);

//   const animeFiltered = animes.filter((anime) => anime.mal_id === favId);
//   console.log(animeFiltered);

//   renderFavorites();
//   // renderAnime();
// }

function listenerFavAnimes() {
  const animeFavList = document.querySelectorAll('.js_fav_list_item');
  for (const li of animeFavList) {
    li.addEventListener('click', handleClick);
  }
}

// local storage

function favStorage() {
  localStorage.setItem('Anime favorites', JSON.stringify(animeFavs));
}

function favDisplay() {
  const favStored = JSON.parse(localStorage.getItem('Anime favorites'));

  if (favStored && favStored !== '') {
    for (const favAnime of favStored) {
      favoritesList.innerHTML += `
        <li id="${favAnime.mal_id}" 
        class="fav-list-item js_list_item other-background font-fav">
        ${favAnime.title} 
        <img class="anime-image" 
        src="${favAnime.images.jpg.image_url}">
        </li>`;
    }
  } else {
    renderFavorites();
  }
  listenerFavAnimes();
}

favDisplay();

// reset button

function handleResetClick() {
  resultsList.innerHTML = '';
  input.value = '';
}

resetBtn.addEventListener('click', handleResetClick);

// reset favs button

const resetFavsBtn = document.querySelector('.js_reset_favs_btn');

function handleResetFavsClick() {
  animeFavs = [];
  favoritesList.innerHTML = '';
  localStorage.removeItem('Anime favorites');
  renderAnime();
}

resetFavsBtn.addEventListener('click', handleResetFavsClick);
