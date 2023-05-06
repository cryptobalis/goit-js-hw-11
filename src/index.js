import Notiflix from 'notiflix';

import "notiflix/dist/notiflix-3.2.6.min.css";

import SimpleLightbox from "simplelightbox";

import "simplelightbox/dist/simple-lightbox.min.css";

import axios from "axios";

const API_KEY = "36023465-a2763392fbf14e712b83e91b9";
const form = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");

let searchQuery = "";
let page = 1;


const fetchImages = async () => {
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
  try {
    const response = await axios.get(url);
    const { data } = response; return data;
  }
  catch (error) {
    console.error(error);
    Notiflix.Notify.failure("An error occurred while fetching images. Please try again later.");
    return null;
  }
};

const displayImages = (data) => { 
  let images = "";
  data.hits.forEach((image) => {
    const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image; images +=`
      <div class="photo-card">
      <a href="${largeImageURL}" data-caption="${tags}">
       <img class="card-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
       </a>
        <div class="info">
         <p class="info-item"><b>Likes</b>: ${likes}</p>
          <p class="info-item"><b>Views</b>: ${views}</p>
          <p class="info-item"><b>Comments</b>: ${comments}</p>
          <p class="info-item"><b>Downloads</b>: ${downloads}</p>
          </div>
          </div>`;
  });


gallery.insertAdjacentHTML("beforeend", images);

const lightbox = new SimpleLightbox('.photo-card a', {
  captionsData: 'data-caption',
});


  if (data.hits.length < 40) {
    loadMoreBtn.style.display = "none";
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  } else { loadMoreBtn.style.display = "block"; }
};

form.addEventListener("submit", async (evt) => {
  evt.preventDefault(); 
  searchQuery = evt.target.searchQuery.value.trim();
  page = 1;
  loadMoreBtn.style.display = "none";

  const data = await fetchImages();
  gallery.innerHTML = "";
  if (data.hits.length === 0) {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  } else if (!searchQuery) {
    Notiflix.Notify.failure("Please enter a search query.");
  } else {
    displayImages(data);
    Notiflix.Notify.success(`Hooray! We found ${ data.totalHits } images.`);
  }
});


  loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  const data = await fetchImages();
  if (!data) return;
  displayImages(data);
});

