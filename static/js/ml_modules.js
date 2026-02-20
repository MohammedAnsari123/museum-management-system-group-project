// ml_modules.js
document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const backBtn = document.querySelector('header button');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'admin_dashboard.html';
        });
    }

    // Event Listeners
    document.getElementById('testRecBtn').addEventListener('click', testRecommendations);
    document.getElementById('predictVisitorBtn').addEventListener('click', predictVisitors);
    document.getElementById('addChatbotBtn').addEventListener('click', addChatbotResponse);

    // Initial Load
    displayChatbotResponses();
});


function testRecommendations() {
    fetch('/api/personalized')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('recommendationResults');
            if (Array.isArray(data) && data.length > 0) {
                let html = '<h4>Recommended Museums:</h4><ul>';
                data.forEach(museum => {
                    html += `<li><strong>${museum.Name}</strong> - ${museum.City} (${museum.Type})</li>`;
                });
                html += '</ul>';
                container.innerHTML = html;
            } else {
                container.innerHTML = '<p>No recommendations available. Need more visitor data.</p>';
            }
        })
        .catch(error => {
            console.log('Error:', error);
            document.getElementById('recommendationResults').innerHTML = '<p>Error loading recommendations.</p>';
        });
}

function predictVisitors() {
    const date = document.getElementById('predictionDate').value;
    if (!date) {
        alert('Please select a date');
        return;
    }

    // Simulate prediction based on day of week
    const dayOfWeek = new Date(date).getDay();
    const predictions = {
        0: 150, // Sunday
        1: 100, // Monday
        2: 120, // Tuesday
        3: 130, // Wednesday
        4: 140, // Thursday
        5: 180, // Friday
        6: 200  // Saturday
    };

    const predictedVisitors = predictions[dayOfWeek] || 120;
    document.getElementById('predictionResults').innerHTML =
        `<h4>Predicted Visitors for ${date}:</h4><p><strong>${predictedVisitors}</strong> visitors</p>`;
}

function addChatbotResponse() {
    const response = document.getElementById('chatbotResponse').value;
    if (!response.trim()) {
        alert('Please enter a response');
        return;
    }

    // Store in localStorage for demo
    let responses = JSON.parse(localStorage.getItem('chatbotResponses')) || [];
    responses.push(response);
    localStorage.setItem('chatbotResponses', JSON.stringify(responses));

    document.getElementById('chatbotResponse').value = '';
    displayChatbotResponses();
}

function displayChatbotResponses() {
    const responses = JSON.parse(localStorage.getItem('chatbotResponses')) || [];
    const container = document.getElementById('chatbotResponses');

    if (responses.length === 0) {
        container.innerHTML = '<p>No responses added yet.</p>';
        return;
    }

    // Using data-index instead of onclick
    let html = '<h4>Stored Responses:</h4><ul>';
    responses.forEach((response, index) => {
        html += `<li>${response} <button class="delete-response-btn" data-index="${index}">Delete</button></li>`;
    });
    html += '</ul>';
    container.innerHTML = html;

    // Re-attach listeners for dynamic buttons
    document.querySelectorAll('.delete-response-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = e.target.getAttribute('data-index');
            deleteResponse(idx);
        });
    });
}

function deleteResponse(index) {
    let responses = JSON.parse(localStorage.getItem('chatbotResponses')) || [];
    responses.splice(index, 1);
    localStorage.setItem('chatbotResponses', JSON.stringify(responses));
    displayChatbotResponses();
}
