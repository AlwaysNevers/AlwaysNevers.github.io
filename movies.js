const rapidApiKey = 'deed5a3976msh2da5e501671388dp140179jsnbc8aa2f9dd6d';

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
    if (searchTerm === '') {
      clearMovies();
      return; // Exit the function early if search term is empty
    }

    // IMDb API search endpoint
    const movieResponse = await fetch(`https://imdb8.p.rapidapi.com/title/find?q=${searchTerm}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
      }
    });
    
    const movieData = await movieResponse.json();

    // Check if the API returned any results
    const combinedResults = movieData.results || [];
    if (combinedResults.length > 0) {
      document.getElementById('noResults').innerText = '';
      displayMovies(combinedResults, 'movieContainer');
    } else {
      document.getElementById('noResults').innerText = 'No results found';
      clearMovies();
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    alert('An error occurred while fetching movies.');
  }
}

function clearMovies() {
  document.getElementById('movieContainer').innerHTML = '';
}

function displayMovies(media, containerId) {
  const mediaContainer = document.getElementById(containerId);
  mediaContainer.innerHTML = ''; // Clear previous results

  if (media.length === 0) {
    document.getElementById('noResults').innerText = 'No results found';
    return;
  }

  media.forEach(item => {
    const mediaItem = document.createElement('div');
    mediaItem.classList.add('movie-item');

    // Ensure the result has an image and title
    const img = document.createElement('img');
    img.src = item.image?.url || 'placeholder_image_url_here'; // Fallback if no image
    mediaItem.appendChild(img);

    const title = document.createElement('p');
    title.innerText = item.title || item.name || 'No Title';
    mediaItem.appendChild(title);

    mediaItem.addEventListener('click', () => redirectToIMDb(item.id));
    mediaContainer.appendChild(mediaItem);
  });
}

function redirectToIMDb(imdbID) {
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
  }, 100); // Adjust time delay as needed (100 milliseconds)

  alert('Close any new tabs that open! They\'re just third-party ads.');
}

// Load popular, recent, and highly rated movies
document.addEventListener('DOMContentLoaded', async function() {
  await loadPopularMovies();
  await loadRecentMovies();
  await loadHighlyRatedMovies();
});

async function loadPopularMovies() {
  try {
    const response = await fetch(`https://imdb8.p.rapidapi.com/title/get-most-popular-movies`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
      }
    });
    const data = await response.json();

    if (data && data.length > 0) {
      displayMovies(data, 'popularMovies');
    } else {
      console.log('No popular movies found');
      // Do not alert on page load; just log it
    }
  } catch (error) {
    console.error('Error fetching popular movies:', error);
  }
}

async function loadRecentMovies() {
  try {
    const response = await fetch(`https://imdb8.p.rapidapi.com/title/get-coming-soon-movies`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
      }
    });
    const data = await response.json();

    if (data && data.length > 0) {
      displayMovies(data, 'recentMovies');
    } else {
      console.log('No recent movies found');
    }
  } catch (error) {
    console.error('Error fetching recent movies:', error);
  }
}

async function loadHighlyRatedMovies() {
  try {
    const response = await fetch(`https://imdb8.p.rapidapi.com/title/get-top-rated-movies`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
      }
    });
    const data = await response.json();

    if (data && data.length > 0) {
      displayMovies(data, 'highRatedMovies');
    } else {
      console.log('No highly rated movies found');
    }
  } catch (error) {
    console.error('Error fetching highly rated movies:', error);
  }
}
