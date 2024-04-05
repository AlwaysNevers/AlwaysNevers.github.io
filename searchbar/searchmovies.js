const searchInput = document.querySelector('.search-input');
let isInputEmpty = true;

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



