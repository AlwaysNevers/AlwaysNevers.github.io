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
    const apiKey = '444b07a8';
    if (searchTerm === '') {
      clearMovies();
      return; // Exit the function early if search term is empty
    }

    // Search for both movies and TV shows using OMDb
    const movieResponse = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}&type=movie`);
    const tvResponse = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}&type=series`);
    const movieData = await movieResponse.json();
    const tvData = await tvResponse.json();

    // Combine movie and TV show results
    const combinedResults = [...(movieData.Search || []), ...(tvData.Search || [])];

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

    // OMDb provides a direct poster URL in `Poster`
    const img = document.createElement('img');
    img.src = item.Poster !== 'N/A' ? item.Poster : 'placeholder_image_url_here'; // Fallback if no poster available
    mediaItem.appendChild(img);

    // Determine media type based on OMDb response
    let mediaType;
    if (item.Type === 'movie') {
      mediaType = 'movie';
    } else if (item.Type === 'series') {
      mediaType = 'tv';
    } else {
      mediaType = 'unknown';
    }

    mediaItem.addEventListener('click', () => redirectToOMDb(item.imdbID, mediaType));
    mediaContainer.appendChild(mediaItem); // Append to the respective category container
  });
}

function redirectToOMDb(imdbID, mediaType) {
  const loading = document.querySelector('.lds-ring'); // Get the loading animation element
  loading.style.display = 'block'; // Display the loading animation

  const mediaUrl = `https://www.imdb.com/title/${imdbID}/`;

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

// OMDb doesn't have direct 'popular', 'recent', or 'highly rated' categories.
// You might need to manually set up categories, using your own movie lists or a different strategy.

document.addEventListener('DOMContentLoaded', async function() {
  await loadPopularMovies(); // This would need customization
  await loadRecentMovies(); // This would need customization
  await loadHighlyRatedMovies(); // This would need customization
});

async function loadPopularMovies() {
  // OMDb doesn't provide direct "popular" or "now playing" endpoints
  // You would need a different approach for these categories, such as manually curating lists
  alert("OMDb does not provide popular movie listings. You can add a manual list here.");
}

async function loadRecentMovies() {
  // Similar to popular movies, OMDb doesn't have recent or now playing
  alert("OMDb does not provide recent movie listings. You can manually add recent movies.");
}

async function loadHighlyRatedMovies() {
  // OMDb does not have a top-rated endpoint either
  alert("OMDb does not provide highly-rated movie listings. You can manually curate these.");
}
