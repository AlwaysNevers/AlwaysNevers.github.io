document.getElementById('searchForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission
  searchMovies();
});

document.getElementById('searchbar').addEventListener('input', function(event) {
  const searchTerm = event.target.value.trim();
  if (searchTerm === '') {
    showCategories(); // Show categories if the search bar is empty
  } else {
    hideCategories(); // Hide categories if the user starts typing
  }
  searchMovies(); // Search movies as the user types
});

function showCategories() {
  const categoryContainers = document.querySelectorAll('.category-container');
  categoryContainers.forEach(container => {
    container.style.display = 'block';
  });
}

function hideCategories() {
  const categoryContainers = document.querySelectorAll('.category-container');
  categoryContainers.forEach(container => {
    container.style.display = 'none';
  });
}

async function searchMovies() {
  try {
    const searchTerm = document.getElementById('searchbar').value.trim();
    const apiKey = 'c0aa80b5561bd96b6cd261ac6d57886c';
    if (searchTerm === '') {
      clearMovies();
      return; // Exit the function early if search term is empty
    }

    // Search for both movies and TV shows
    const movieResponse = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}`);
    const tvResponse = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${searchTerm}`);
    const movieData = await movieResponse.json();
    const tvData = await tvResponse.json();

    // Combine movie and TV show results
    const combinedResults = [...movieData.results, ...tvData.results];

    if (combinedResults.length > 0) {
      // Clear "No results found" message
      document.getElementById('noResults').innerText = '';
      // Display the movies and TV shows
      displayMovies(combinedResults, 'movieContainer');
    } else {
      // Display "No results found!" text on the screen
      document.getElementById('noResults').innerText = 'No results found';
      // Clear any existing movies from the screen
      clearMovies();
    }
  } catch (error) {
    console.error('Error fetching movies and TV shows:', error);
    // Prevent alert when clearing search bar
    const searchTerm = document.getElementById('searchbar').value.trim();
    if (searchTerm !== '') {
      alert('An error occurred while fetching movies and TV shows.');
    }
  }
}

function clearMovies() {
  document.getElementById('movieContainer').innerHTML = '';
}

function displayMovies(media, containerId) {
  const mediaContainer = document.getElementById(containerId);
  mediaContainer.innerHTML = ''; // Clear previous results

  media.forEach(item => {
    const mediaItem = document.createElement('div');
    mediaItem.classList.add('movie-item');

    const posterPath = `https://image.tmdb.org/t/p/w200${item.poster_path}`;
    const img = document.createElement('img');
    img.src = posterPath;
    mediaItem.appendChild(img);

    // Determine media type based on endpoint
    let mediaType;
    if (item.hasOwnProperty('title')) {
      mediaType = 'movie';
    } else if (item.hasOwnProperty('name')) {
      mediaType = 'tv';
    } else {
      mediaType = 'unknown'; // Handle unknown media types
    }

    mediaItem.addEventListener('click', () => redirectToTMDb(item.id, mediaType));
    mediaContainer.appendChild(mediaItem); // Append to the respective category container
  });
}

function redirectToTMDb(mediaId, mediaType) {
  const loading = document.querySelector('.lds-ring'); // Get the loading animation element
  loading.style.display = 'block'; // Display the loading animation

  let mediaUrl;
  if (mediaType === 'movie') {
    mediaUrl = `https://vidsrc.cc/v2/embed/movie/${mediaId}`;
  } else if (mediaType === 'tv') {
    mediaUrl = `https://vidsrc.cc/v2/embed/tv/${mediaId}`; // Correct URL for TV shows
  }

  const iframe = document.createElement("iframe");
  iframe.src = mediaUrl;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "0";
  iframe.style.position = "fixed";
  iframe.style.top = "0";
  iframe.style.left = "0";
  iframe.referrerPolicy = "no-referrer";
  iframe.allow = "fullscreen";

  setTimeout(function() {
    document.getElementById("movieContainer").innerHTML = ""; // Clear previous content
    document.getElementById("movieContainer").appendChild(iframe);
    loading.style.display = 'none'; // Hide loading animation when iframe content is loaded
  }, 100); // Adjust time delay as needed (100 milliseconds)

  alert('Close any new tabs that open! They\'re just third-party ads and I can\'t get rid of them :(');
}

// Load popular, recent, and highly rated movies
document.addEventListener('DOMContentLoaded', async function() {
  await loadPopularMovies();
  await loadRecentMovies();
  await loadHighlyRatedMovies();
});

async function loadPopularMovies() {
  try {
    const apiKey = 'c0aa80b5561bd96b6cd261ac6d57886c';
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
    const data = await response.json();

    if (data.results.length > 0) {
      displayMovies(data.results, 'popularMovies');
    } else {
      alert('No popular movies found!');
    }
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    alert('An error occurred while fetching popular movies.');
  }
}

async function loadRecentMovies() {
  try {
    const apiKey = 'c0aa80b5561bd96b6cd261ac6d57886c';
    const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`);
    const data = await response.json();

    if (data.results.length > 0) {
      displayMovies(data.results, 'recentMovies');
    } else {
      alert('No recent movies found!');
    }
  } catch (error) {
    console.error('Error fetching recent movies:', error);
    alert('An error occurred while fetching recent movies.');
  }
}

async function loadHighlyRatedMovies() {
  try {
    const apiKey = 'c0aa80b5561bd96b6cd261ac6d57886c';
    const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`);
    const data = await response.json();

    if (data.results.length > 0) {
      displayMovies(data.results, 'highRatedMovies');
    } else {
      alert('No highly rated movies found!');
    }
    } catch (error) {
    console.error('Error fetching highly rated movies:', error);
    alert('An error occurred while fetching highly rated movies.');
    }
    }
