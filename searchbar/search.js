const searchInput = document.querySelector('.search-input');
let isInputEmpty = true;
// Array of game names
const gameNames = Array.from(document.querySelectorAll('.small-text')).map(elem => elem.textContent.toLowerCase());

// Function to filter and display games based on search input
function filterGames(searchQuery) {
    const filteredGames = gameNames.filter(name => name.includes(searchQuery.toLowerCase()));

    // Loop through all games and show/hide based on filtering
    gameNames.forEach((name, index) => {
        const gameElement = document.querySelectorAll('.col')[index];
        if (filteredGames.includes(name)) {
            gameElement.style.display = 'block';
        } else {
            gameElement.style.display = 'none';
        }
    });
}

// Event listener for input changes
searchInput.addEventListener('input', function() {
    const searchQuery = this.value.trim();
    filterGames(searchQuery);
});




searchInput.addEventListener('focus', function() {
    this.style.width = '100%';
});

searchInput.addEventListener('blur', function() {
    if (isInputEmpty) {
        this.style.width = '0px';
    }
});

searchInput.addEventListener('input', function() {
    if (this.value.trim() === '') {
        isInputEmpty = true;
    } else {
        isInputEmpty = false;
    }
});

document.querySelector('.search-container').addEventListener('mouseenter', function() {
    if (isInputEmpty) {
        searchInput.style.width = '100%';
    }
});

document.querySelector('.search-container').addEventListener('mouseleave', function() {
    if (isInputEmpty) {
        searchInput.style.width = '0px';
    }
});



