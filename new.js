window.addEventListener('load', function() {
  document.getElementById('loading-icon').style.display = 'none';

  document.getElementById('content').style.display = 'block';
});












const apiKey = "543f69d2bbf810ca63adf5bbbe256bbf";
let page = 1;
let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&page=${page}`;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};
const baseURL = "https://image.tmdb.org/t/p/";
const imageSize = "w500";

document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".header");

  const leftDiv = document.createElement("div");
  leftDiv.classList.add("left");

  const popularMoviesLink = document.createElement("a");
  popularMoviesLink.setAttribute("href", "index.html");
  popularMoviesLink.classList.add("popularMoviesURL");
  popularMoviesLink.textContent = "Popular Movies";

  const newMoviesLink = document.createElement("a");
  newMoviesLink.setAttribute("href", "#");
  newMoviesLink.classList.add("newMoviesLink");
  newMoviesLink.textContent = "New Movies";

  const favoriteMoviesLink = document.createElement("a");
  favoriteMoviesLink.setAttribute("href", "#");
  favoriteMoviesLink.textContent = "Favorite Movies";

  leftDiv.appendChild(popularMoviesLink);
  leftDiv.appendChild(newMoviesLink);
  leftDiv.appendChild(favoriteMoviesLink);

  const rightDiv = document.createElement("div");
  rightDiv.classList.add("right");

  const inputField = document.createElement("input");
  inputField.setAttribute("type", "text");
  inputField.setAttribute("placeholder", "Find movies...");
  inputField.setAttribute("id", "inputField");
  var input = inputField.classList.add("input");
  const dropdownList = document.createElement("div");
  dropdownList.setAttribute("id", "dropdownList");
  dropdownList.classList.add("dropdown-list");

  const dropdownContainer = document.createElement("div");
  dropdownContainer.classList.add("dropdown");
  dropdownContainer.appendChild(inputField);
  dropdownContainer.appendChild(dropdownList);

  const containerDiv = document.createElement("div");
  containerDiv.classList.add("headerContainer");
  containerDiv.append(leftDiv, rightDiv);

  header.appendChild(containerDiv);
  rightDiv.appendChild(dropdownContainer);

  inputField.addEventListener("input", () => {
    let value = inputField.value;

    document.querySelectorAll(".movieDiv").forEach((el) => el.remove());
    console.log(document.querySelectorAll(".movieDiv"));
    document.querySelector(".dropdown-list").style.display = "block";
  });
  inputField.addEventListener("blur", (event) => {
    if (!dropdownContainer.contains(event.relatedTarget)) {
      document.querySelector(".dropdown-list").style.display = "none";
    }
  });
});


document.addEventListener("DOMContentLoaded", function() {
  let popularMoviesURL = "index.html";

  ч
  document.addEventListener('click', function(event) {
    let target = event.target;
    if (target && target.classList.contains('popularMoviesURL')) {
      event.preventDefault(); 
      console.log("Link clicked!");
      console.log("Redirecting to:", popularMoviesURL);
      window.location.href = 'index.html';
    }
  });
});


document.addEventListener("DOMContentLoaded", function () {
  let newMoviesURL = "newMovies.html";
  
  const newMoviesLink = document.createElement("a");
  let popularMoviesLink = document.createElement("a");
  
  

  
  newMoviesLink.setAttribute("href", "#");
  newMoviesLink.classList.add("newMoviesLink");
  newMoviesLink.textContent = "New Movies";
  document
    .querySelector(".newMoviesLink")
    .addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = newMoviesURL;
    });
});

function fetchAndRenderMovies(pageNumber) {
  const pageUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&page=${pageNumber}`;

  fetch(pageUrl, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const movies = data.results;
      renderMovies(movies);
      console.log(movies);

      let input = document.querySelector(".input");

      input.addEventListener("input", () => {
        let value = input.value;
        value = input.value;
        movies.forEach((movie) => {
          let movieDiv = document.createElement("div");
          movieDiv.classList.add("movieDiv");
          let arr = Object.values(movie).join("");
          movieDiv.addEventListener("click", () => {
            window.location.href = `details.html?id=${movie.id}`;
          });
          if (arr.toLowerCase().includes(value)) {
            let movieTitle = document.createElement("span");
            movieTitle.innerHTML = movie.title;
            movieTitle.classList.add("movieTitle");
            let rating = document.createElement("span");
            rating.classList.add("movieRate");
            rating.innerHTML = `IMDB: ${movie.vote_average.toFixed(
              2
            )} <img class="star" src="img/starpng.png" >`;
            let img = document.createElement("img");
            img.src = `${movie.poster_path ? `${baseURL}${imageSize}${movie.poster_path}` : './img/default.jpg'}`;

            img.alt = movieTitle;
            img.style.width = "70px";
            let imgDiv = document.createElement("div");
            imgDiv.classList.add("imgDiv");
            imgDiv.appendChild(img);
            let textDiv = document.createElement("div");
            textDiv.classList.add("textDiv");
            textDiv.append(movieTitle, rating);
            movieDiv.append(imgDiv, textDiv);
            console.log("arr", arr);
            console.log("dehsett");
          } else {
            movieDiv.textContent = "";
            movieDiv.style.display = "none";
          }
          document.querySelector(".dropdown-list").appendChild(movieDiv);
        });
        console.log(value);
      });
    })
    .catch((err) => console.error(err));
}
function renderMovies(movies) {
  let moviesContainer = document.querySelector(".movies");
  moviesContainer.innerHTML = "";

  movies.forEach((movie) => {
    let movieElement = document.createElement("div");
    movieElement.classList.add("movie");

    let imgCont = document.createElement("div");
    imgCont.classList.add("imgCont");

    let img = document.createElement("img");
    img.src = `${movie.poster_path ? `${baseURL}${imageSize}${movie.poster_path}` : './img/default.jpg'}`;

    imgCont.appendChild(img);

    let movieDetails = document.createElement("div");
    movieDetails.classList.add("movieDetails");
    let title = document.createElement("span");
    title.innerText = movie.title;
    title.classList.add("title");
    let rating = document.createElement("span");
    rating.classList.add("rating");
    rating.innerHTML = `IMDB: ${(movie.vote_average).toFixed(2)} <img class="star" src="img/starpng.png" >`;
    movieDetails.append(title, rating);
    movieElement.append(imgCont, movieDetails);
    console.log(movieDetails);
    moviesContainer.appendChild(movieElement);
    movieElement.addEventListener("click", () => {
      let id = movie.id;
      let url = `details.html?id=${id}`;
      window.location.href = url;
    });
  });
}

function pagination() {
  const container = document.querySelector(".container");
  let buttons = document.createElement("div");
  buttons.classList.add("buttons");

  let recordPerPage = 4;
  let activePage = 1;
  let totalRecords = 1000;
  let totalPage = Math.ceil(totalRecords / recordPerPage);
  let start = activePage - 1 > 0 ? activePage - 1 : 1;
  let end = activePage + 2 <= totalPage ? activePage + 2 : totalPage;

  const updatePagination = () => {
    buttons.innerHTML = "";
    start = activePage - 2 > 0 ? activePage - 2 : 1;
    end = activePage + 2 <= totalPage ? activePage + 2 : totalPage;
    for (let i = start; i <= end; i++) {
      const button = document.createElement("button");
      button.textContent = i;

      button.addEventListener("click", () => {
        document.querySelectorAll("button").forEach((btn) => {
          btn.classList.remove("active");
        });
        activePage = i;
        button.classList.add("active");
        fetchAndRenderMovies(activePage);
        updatePagination();
      });

      buttons.appendChild(button);
    }
  };

  updatePagination();

  container.appendChild(buttons);
}

pagination();

fetchAndRenderMovies(page);
