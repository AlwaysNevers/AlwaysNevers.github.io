

function leftScroll(containerId) {
    const container = document.getElementById(containerId);
    container.scrollBy({
        left: -600, // Adjust scroll amount as needed
        behavior: 'smooth'
    });
}

function rightScroll(containerId) {
    const container = document.getElementById(containerId);
    container.scrollBy({
        left: 600, // Adjust scroll amount as needed
        behavior: 'smooth'
    });
}

const apiBaseUrl = "https://streamed.su"; 
const placeholderImage = "fallback.png";

// Generic function to fetch matches
async function fetchMatches(sport, containerId) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/matches/${sport}/popular`);
        if (!response.ok) throw new Error(`Failed to fetch ${sport} matches.`);
        const matches = await response.json();
        displayMatches(matches, containerId);
    } catch (error) {
        console.error(`Error fetching ${sport} matches:`, error);
        document.getElementById(containerId).innerHTML = `<p class='no-data'>Failed to load ${sport} matches. Please try again later.</p>`;
    }
}

// Generic function to display matches
function displayMatches(matches, containerId) {
    const matchesContainer = document.getElementById(containerId);
    matchesContainer.innerHTML = "";

    if (matches.length === 0) {
        matchesContainer.innerHTML = "<p class='no-data'>No matches available right now.</p>";
        return;
    }

    const currentTime = new Date();

    matches.forEach(match => {
        const { id, title, date, poster, sources = [] } = match;

        const matchStartTime = new Date(date);
        const isLive = matchStartTime <= currentTime;

        const matchCard = document.createElement("div");
        matchCard.classList.add("stream-card");

        const posterUrl = poster ? `${apiBaseUrl}${poster}` : placeholderImage;

        matchCard.innerHTML = `
            <div class="${isLive ? "live-badge" : "start-time-badge"}">
                ${isLive ? "LIVE" : matchStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <img src="${posterUrl}" alt="${title}" onerror="this.onerror=null; this.src='${placeholderImage}';" style="width: 100%; height: auto; border-radius: 5px;">
            <h3>${title || "Match"}</h3>
            <p>${new Date(date).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
            ${isLive ? `<button class="button" onclick="fetchStreams('${sources[0].id}')">View Streams</button>` : `<button class="button upcoming-button" disabled>Upcoming</button>`}
        `;

        matchesContainer.appendChild(matchCard);
    });
}

// Fetch matches for each sport
fetchMatches("live", "matches-container");
fetchMatches("football", "soccer-container");
fetchMatches("american-football", "football-container");
fetchMatches("hockey", "hockey-container");
fetchMatches("baseball", "baseball-container");
fetchMatches("motor-sports", "motorsports-container");
fetchMatches("fight", "fight-container");
fetchMatches("tennis", "tennis-container");
fetchMatches("rugby", "rugby-container");
fetchMatches("golf", "golf-container");
fetchMatches("billiards", "billiards-container");
fetchMatches("afl", "afl-container");
fetchMatches("darts", "darts-container");
fetchMatches("cricket", "cricket-container");
fetchMatches("other", "other-container");

function fetchStreams(streamId) {
    const apiUrl = `${apiBaseUrl}/api/stream/alpha/${streamId}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) {
                const mediaUrl = data[0].embedUrl;

                // Disable scrolling on the main page
                document.body.style.overflow = 'hidden';

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
                iframe.style.zIndex = '9998'; // Ensure it appears above most other elements

                document.body.appendChild(iframe);

                const closeButton = document.createElement("button");
                closeButton.textContent = "Close Stream";
                closeButton.style.backgroundColor = "rgba(213, 198, 255, 0.25)";
                closeButton.style.color = "white"; // Set text color for contrast
                closeButton.style.border = "2px solid #521ce7"; 
                closeButton.style.padding = "10px 15px"; // Optional: add some padding
                closeButton.style.borderRadius = "10px"; // Optional: rounded corners
                closeButton.style.position = "fixed"; // Change to fixed if necessary
                closeButton.style.top = "-15px"; // Adjust for better visibility
                closeButton.style.right = "83px"; // Adjust for better visibility
                closeButton.style.zIndex = "9999"; // Ensure the close button appears above the iframe
                closeButton.onclick = () => {
                    document.body.removeChild(iframe);
                    document.body.removeChild(closeButton);

                    // Re-enable scrolling on the main page
                    document.body.style.overflow = '';
                    document.removeEventListener('keydown', handleKeyDown); // Clean up the event listener
                };

                // Keyboard accessibility
                const handleKeyDown = (event) => {
                    if (event.key === 'Escape') {
                        closeButton.click(); // Simulate click to close the stream
                    }
                };
                document.addEventListener('keydown', handleKeyDown);

                document.body.appendChild(closeButton);
            } else {
                alert('No streams available at this time.');
            }
        })
        .catch(error => {
            console.error('Error fetching streams:', error);
            alert('There was an error fetching the streams. Please try again later. ' + error.message);
        });
}
