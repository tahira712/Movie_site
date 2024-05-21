window.addEventListener("load", function () {
  document.getElementById("loading-icon").style.display = "none";

  document.getElementById("content").style.display = "block";
});

const apiKey = "543f69d2bbf810ca63adf5bbbe256bbf";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

const search = window.location.search;
const params = new URLSearchParams(search);
const id = params.get("id");
console.log(id);

function fetchAndRenderMovie(movieId) {
  const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;

  fetch(movieUrl, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((movie) => {
      renderMovie(movie);

      fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=543f69d2bbf810ca63adf5bbbe256bbf`
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response for credits was not ok");
          }
          return res.json();
        })
        .then((data) => {
          let swiperWrapper = document.querySelector(".swiper-wrapper");

          let genre_id = movie.genres;
          let genre_ids = genre_id.map((genre) => genre.id);

          console.log("myMovie", genre_ids);

          function concatPopularAndNowPlaying() {
            const fetchNowPlayingMovies = () => {
              const nowPlayingUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`;

              return fetch(nowPlayingUrl, options)
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Network response was not ok");
                  }
                  return response.json();
                })
                .then((data) => {
                  const movies = data.results;
                  return movies.filter((mov) => {
                    return mov.genre_ids.some((genreId) =>
                      genre_ids.includes(genreId)
                    );
                  });
                });
            };

            const fetchPopularMovies = () => {
              const popularUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;

              return fetch(popularUrl, options)
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Network response was not ok");
                  }
                  return response.json();
                })
                .then((data) => {
                  const movies = data.results;

                  let input = document.querySelector(".input");
                  let value = input.value;
                  document.querySelector(".dropdown-list").innerHTML = " ";
                  input.addEventListener("input", () => {
                    let value = input.value;

                    input.value = value;
                    console.log(value);

                    movies.forEach((movie) => {
                      console.log("movie", movie);
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
                        )} <img class="star" src="./img/starpng.png" >`;
                        let img = document.createElement("img");
                        img.src = `${
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : "./img/default.jpg"
                        }`;
                        console.log(movie.poster_path);
                        img.alt = movieTitle;
                        img.style.width = "100px";
                        img.style.height = "100px";
                        img.style.objectFit = "contain";
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
                      document
                        .querySelector(".dropdown-list")
                        .appendChild(movieDiv);
                    });

                    document.querySelector(".dropdown-list").style.display =
                      "block";
                  });

                  return movies.filter((mov) => {
                    return mov.genre_ids.some((genreId) =>
                      genre_ids.includes(genreId)
                    );
                  });
                });
            };

            Promise.all([fetchNowPlayingMovies(), fetchPopularMovies()])
              .then(([nowPlayingMovies, popularMovies]) => {
                const concatMovies = nowPlayingMovies.concat(popularMovies);
                concatMovies.forEach((movie) => {
                  let simMovieDiv = document.createElement("div");
                  simMovieDiv.classList.add("swiper-slide");
                  simMovieDiv.classList.add("swiper-slide1");
                  let simMovieImg = document.createElement("img");
                  simMovieImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                  simMovieImg.alt = movie.title;
                  simMovieDiv.appendChild(simMovieImg);
                  document
                    .querySelector(".swiper-wrapper2")
                    .append(simMovieDiv);
                  simMovieDiv.addEventListener("click", (event) => {
                    window.location.href = `details.html?id=${movie.id}`;
                  });
                });
              })
              .catch((error) => console.error("Error:", error));
          }

          concatPopularAndNowPlaying();

          if (!swiperWrapper) {
            console.error("Swiper wrapper not found!");
            return;
          }

          if (!data || !data.cast || data.cast.length === 0) {
            console.error("No cast data found!");
            return;
          }

          data.cast.forEach((actor) => {
            let actorImgDiv = document.createElement("div");
            actorImgDiv.classList.add("swiper-slide");
            actorImgDiv.classList.add("swiper-slide2");

            let actorImgElement = document.createElement("img");
            actorImgElement.src = actor.profile_path
              ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
              : "./img/placeholder.jpeg";

            actorImgElement.alt = actor.name;
            let imgDiv = document.createElement("div");
            imgDiv.classList.add("imgDivActor");
            imgDiv.append(actorImgElement);
            let actorName = document.createElement("p");
            actorName.textContent = actor.name;
            actorName.classList.add("actor-name");
            let character = document.createElement("p");
            character.innerHTML = `<span class='sub'>Character:</span>  ${actor.character}`;
            let popularity = document.createElement("p");
            popularity.innerHTML = `<span class='sub'>Popularity:</span>  ${actor.popularity}`;
            character.classList.add("character");
            let textDiv = document.createElement("div");
            textDiv.classList.add("textDivActor");
            textDiv.append(actorName, character, popularity);
            actorImgDiv.append(imgDiv, textDiv);
            swiperWrapper.appendChild(actorImgDiv);
          });
        })
        .catch((err) => console.error("Error:", err));
    });
}

function renderMovie(movie) {
  let details = document.querySelector(".details");
  details.innerHTML = "";

  let detailDiv = document.createElement("div");
  detailDiv.classList.add("detailDiv");
  let imgDiv = document.createElement("div");
  let img = document.createElement("img");
  imgDiv.appendChild(img);
  img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  let title = document.createElement("h1");
  title.textContent = movie.title;
  let overview = document.createElement("p");
  overview.textContent = movie.overview;
  let debut = document.createElement("p");
  debut.innerHTML = `<span class='sub'>Release:</span>  ${movie.release_date}`;

  let budget = document.createElement("p");
  budget.innerHTML = `<span class='sub'>Budget:</span>  ${movie.budget}  $`;
  let revenue = document.createElement("p");
  revenue.innerHTML = `<span class='sub'>Revenue:</span>  ${movie.revenue}`;
  let runtime = document.createElement("p");
  runtime.innerHTML = `<span class='sub'>Duration:</span>  ${movie.runtime}  min`;
  let tagline = document.createElement("p");
  tagline.innerHTML = `<span class='sub'>Tagline:</span>  ${movie.tagline}`;

  let genre = document.createElement("p");
  let genreNames = movie.genres.map((genre) => genre.name);
  genre.innerHTML = `<span class='sub'>Genre:</span>  ${genreNames.join(", ")}`;
  let video = document.createElement("a");

  async function getVideo() {
    let url = `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=543f69d2bbf810ca63adf5bbbe256bbf`;
    let response = await fetch(url, options);
    let data = await response.json();
    return data;
  }
  getVideo()
    .then((data) => data.results)
    .then((data) => data[0])
    .then((data) => {
      video.href = `https://www.youtube.com/watch?v=${data.key}`;
    });

  video.classList.add("video");
  video.innerHTML = "Watch Trailer";

  detailDiv.append(
    imgDiv,
    title,
    overview,
    debut,
    budget,
    revenue,
    runtime,
    tagline,
    genre,
    video
  );
  details.appendChild(detailDiv);
}

document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".header");

  const leftDiv = document.createElement("div");
  leftDiv.classList.add("left");

  const popularMoviesLink = document.createElement("a");
  popularMoviesLink.setAttribute("href", "#");
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
  // inputField.addEventListener("blur", (event) => {
  //   if (!dropdownContainer.contains(event.relatedTarget)) {
  //     document.querySelector(".dropdown-list").style.display = "none";
  //   }
  // });
  let newMoviesURL = "newMovies.html";
  let popularMoviesURL = "index.html";
  document
    .querySelector(".popularMoviesURL")
    .addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = popularMoviesURL;
    });

  document
    .querySelector(".newMoviesLink")
    .addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = newMoviesURL;
    });
});

fetchAndRenderMovie(id);

function fetchAndRenderPopularMovies(page) {
  let urlPopular = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`;

  fetch(urlPopular, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      renderPopularMovies(data.results);
    })
    .catch((err) => console.error(err));
}

function renderPopularMovies(movies) {
  let container = document.createElement("div");
  container.classList.add("popular-container");
  container.innerHTML = ``;
  container.innerHTML = "";

  movies.forEach((movie) => {
    let movieDiv = document.createElement("div");
    movieDiv.classList.add("movie");

    let title = document.createElement("h2");
    title.textContent = movie.title;

    let img = document.createElement("img");
    img.src = `https://image.tmdb.org/t/p/w500$${movie.poster_path}`;
    img.alt = movie.title;

    let overview = document.createElement("p");
    overview.textContent = movie.overview;

    movieDiv.append(title, img, overview);
    container.appendChild(movieDiv);
  });
}

fetchAndRenderPopularMovies(1);
