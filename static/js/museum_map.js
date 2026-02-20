let map;
let markers = [];
let allMuseums = [];
let filteredMuseums = [];

// Initialize map
function initMap() {
    map = L.map('map').setView([23.5937, 78.9629], 5); // Center of India

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    loadMuseums();
}

// Load museum data
async function loadMuseums() {
    try {
        // For static version, we'll use mock data
        const data = [
            { Name: "National Museum", City: "Delhi", State: "Delhi", Type: "History", Latitude: 28.6139, Longitude: 77.2090, Established: "1949" },
            { Name: "Indian Museum", City: "Kolkata", State: "West Bengal", Type: "History", Latitude: 22.5726, Longitude: 88.3639, Established: "1814" },
            { Name: "Salar Jung Museum", City: "Hyderabad", State: "Telangana", Type: "Art", Latitude: 17.3850, Longitude: 78.4867, Established: "1951" },
            { Name: "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya", City: "Mumbai", State: "Maharashtra", Type: "History", Latitude: 19.0760, Longitude: 72.8777, Established: "1922" },
            { Name: "Government Museum", City: "Chennai", State: "Tamil Nadu", Type: "Science", Latitude: 13.0827, Longitude: 80.2707, Established: "1851" },
            { Name: "National Gallery of Modern Art", City: "Delhi", State: "Delhi", Type: "Art", Latitude: 28.6129, Longitude: 77.2295, Established: "1954" },
            { Name: "Albert Hall Museum", City: "Jaipur", State: "Rajasthan", Type: "Cultural", Latitude: 26.9124, Longitude: 75.7873, Established: "1887" },
            { Name: "Visvesvaraya Industrial & Technological Museum", City: "Bangalore", State: "Karnataka", Type: "Science", Latitude: 12.9716, Longitude: 77.5946, Established: "1962" }
        ];

        allMuseums = data;
        filteredMuseums = [...allMuseums];

        // Populate filters
        populateFilters();

        // Display museums
        displayMuseums();

        // Update stats
        updateStats();

    } catch (error) {
        console.log('Error loading museums:', error);
    }
}

// Populate filter dropdowns
function populateFilters() {
    const types = [...new Set(allMuseums.map(m => m.Type).filter(t => t))];
    const states = [...new Set(allMuseums.map(m => m.State).filter(s => s))];

    const typeFilter = document.getElementById('typeFilter');
    const stateFilter = document.getElementById('stateFilter');

    if (typeFilter) {
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            typeFilter.appendChild(option);
        });
    }

    if (stateFilter) {
        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateFilter.appendChild(option);
        });
    }
}

// Display museums on map
function displayMuseums() {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    filteredMuseums.forEach(museum => {
        if (museum.Latitude && museum.Longitude) {
            const marker = L.marker([museum.Latitude, museum.Longitude])
                .bindPopup(createPopupContent(museum))
                .addTo(map);

            markers.push(marker);
        }
    });
}

// Create popup content
function createPopupContent(museum) {
    return `
        <div class="museum-popup">
            <h3>${museum.Name}</h3>
            <p><strong>City:</strong> ${museum.City || 'N/A'}</p>
            <p><strong>State:</strong> ${museum.State || 'N/A'}</p>
            <p><strong>Type:</strong> <span class="type">${museum.Type || 'N/A'}</span></p>
            ${museum.Established ? `<p><strong>Established:</strong> ${museum.Established}</p>` : ''}
        </div>
    `;
}

// Update statistics
function updateStats() {
    document.getElementById('totalMuseums').textContent = allMuseums.length;
    document.getElementById('totalStates').textContent = new Set(allMuseums.map(m => m.State).filter(s => s)).size;
    document.getElementById('totalTypes').textContent = new Set(allMuseums.map(m => m.Type).filter(t => t)).size;
    document.getElementById('museumsWithCoords').textContent = allMuseums.filter(m => m.Latitude && m.Longitude).length;
}

// Filter museums
function filterMuseums() {
    const typeFilter = document.getElementById('typeFilter').value;
    const stateFilter = document.getElementById('stateFilter').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    filteredMuseums = allMuseums.filter(museum => {
        const matchesType = !typeFilter || museum.Type === typeFilter;
        const matchesState = !stateFilter || museum.State === stateFilter;
        const matchesSearch = !searchInput ||
            museum.Name.toLowerCase().includes(searchInput) ||
            museum.City.toLowerCase().includes(searchInput) ||
            museum.Type.toLowerCase().includes(searchInput);

        return matchesType && matchesState && matchesSearch;
    });

    displayMuseums();
}

// Event listeners
document.getElementById('typeFilter')?.addEventListener('change', filterMuseums);
document.getElementById('stateFilter')?.addEventListener('change', filterMuseums);
document.getElementById('searchInput')?.addEventListener('input', filterMuseums);

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', initMap);
