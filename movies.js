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
        return;
    }
    const apiKey = 'c0aa80b5561bd96b6cd261ac6d57886c';
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}`);
    const data = await response.json();

    console.log(data); // Log the response for debugging

    if (data.results.length > 0) {
        // Clear "No results found" message
        document.getElementById('noResults').innerText = '';
        // Display the movies
        displayMovies(data.results, 'movieContainer');
    } else {
        // Display "No results found!" text on the screen
        document.getElementById('noResults').innerText = 'No results found';
        // Clear any existing movies from the screen
        clearMovies();
    }
} catch (error) {
    console.error('Error fetching movies:', error);
    alert('An error occurred while fetching movies.');
}
}


function displayMovies(movies, containerId) {
const movieContainer = document.getElementById(containerId);
movieContainer.innerHTML = ''; // Clear previous results

movies.forEach(movie => {
if (movie.poster_path) {
const movieItem = document.createElement('div');
movieItem.classList.add('movie-item');

const posterPath = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
const img = document.createElement('img');
img.src = posterPath;
movieItem.appendChild(img);

movieItem.addEventListener('click', () => redirectToTMDb(movie.id));
movieContainer.appendChild(movieItem); // Append to the respective category container
}
});
}

function redirectToTMDb(movieId) {
    const loading = document.querySelector('.lds-ring'); // Get the loading animation element
    loading.style.display = 'block'; // Display the loading animation

    const movieUrl = `https://vidsrc.to/embed/movie/${movieId}`;
    const iframe = document.createElement("iframe");
    iframe.src = movieUrl;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "0";
    iframe.style.position = "fixed";
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.referrerPolicy = "no-referrer";
    iframe.allow = "fullscreen";
    
    // Append iframe after a short delay to allow the loading animation to be displayed
    setTimeout(function() {
        // Append iframe after loading animation is displayed
        document.getElementById("movieContainer").innerHTML = ""; // Clear previous content
        document.getElementById("movieContainer").appendChild(iframe);
        loading.style.display = 'none'; // Hide loading animation when iframe content is loaded
    }, 100); // Adjust time delay as needed (100 milliseconds)
}

function clearMovies() {
  document.getElementById('movieContainer').innerHTML = '';
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

    console.log(data); // Log the response for debugging

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

    console.log(data); // Log the response for debugging

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

    console.log(data); // Log the response for debugging

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