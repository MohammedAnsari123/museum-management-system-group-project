
// VisitorsHomePage.js - Main Logic for Visitor Dashboard

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initializeNavigation();
    loadDashboardStats();
    loadRecentBookings();
    loadHistory();
    loadMyRatings();
    loadExhibitions();
    loadPopularExhibits();
    loadAIRecommendations();
    loadPersonalizedRecommendations();

    // Initialize Charts
    initForeignVisitorsChart();

    // Initialize Booking System
    const bookingSystem = new MuseumBookingSystem();

    // Wire up global search button
    const searchBtn = document.querySelector('.buttonss');
    if (searchBtn) {
        searchBtn.addEventListener('click', getRecommendations);
    }

    // Handle Logout
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            fetch('/api/auth/logout', { method: 'POST' })
                .then(() => {
                    window.location.href = 'visitor_login.html';
                })
                .catch(err => console.error('Logout failed', err));
        });
    }
});

// Navigation helpers
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Function to get recommendations (Search handler)
function getRecommendations() {
    const searchInput = document.getElementById('searchInput');
    const resultDiv = document.getElementById('result');
    if (!searchInput || !resultDiv) return;

    const query = searchInput.value.toLowerCase();
    resultDiv.innerHTML = '<p>Searching...</p>';

    // Simulate API search
    setTimeout(() => {
        // Mock data
        const museums = [
            { name: 'National Museum', city: 'Delhi', type: 'History' },
            { name: 'Indian Museum', city: 'Kolkata', type: 'History' },
            { name: 'Salar Jung Museum', city: 'Hyderabad', type: 'Art' },
            { name: 'Science Centre', city: 'Mumbai', type: 'Science' }
        ];

        const filtered = museums.filter(m =>
            m.name.toLowerCase().includes(query) ||
            m.city.toLowerCase().includes(query) ||
            m.type.toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
            resultDiv.innerHTML = '<p>No museums found.</p>';
        } else {
            let html = '<ul class="search-results-list">';
            filtered.forEach(m => {
                html += `<li><strong>${m.name}</strong> - ${m.city} (${m.type})</li>`;
            });
            html += '</ul>';
            resultDiv.innerHTML = html;
        }
    }, 500);
}

// Stats Loading
function loadDashboardStats() {
    // Simulate API
    setTimeout(() => {
        document.getElementById('totalBookings').textContent = '12';
        document.getElementById('visitedMuseums').textContent = '5';
        document.getElementById('avgRating').textContent = '4.8';
        document.getElementById('upcomingTours').textContent = '2';
    }, 500);
}

// Recent Bookings
function loadRecentBookings() {
    const container = document.getElementById('recentBookings');
    if (!container) return;

    // Simulate empty or populated
    const bookings = [
        { museum: 'National Museum', date: '2025-01-20', status: 'Upcoming' },
        { museum: 'Art Gallery', date: '2025-01-10', status: 'Completed' }
    ];

    if (bookings.length === 0) {
        document.getElementById('noBookings').style.display = 'block';
    } else {
        let html = '';
        bookings.forEach(b => {
            html += `
            <div class="booking-card">
                <h4>${b.museum}</h4>
                <p><i class="fas fa-calendar"></i> ${b.date}</p>
                <span class="status ${b.status.toLowerCase()}">${b.status}</span>
            </div>`;
        });
        container.innerHTML = html;
    }
}

// History
function loadHistory() {
    const tbody = document.getElementById('historyTableBody');
    if (!tbody) return;

    // Mock data
    const history = [
        { museum: 'National Museum', date: '2025-01-20', time: '10:00', status: 'Upcoming', rating: null },
        { museum: 'Science City', date: '2024-12-15', time: '14:00', status: 'Completed', rating: 5 }
    ];

    let html = '';
    history.forEach(h => {
        const rating = h.rating ? '★'.repeat(h.rating) : '-';
        html += `
        <tr>
            <td>${h.museum}</td>
            <td>${h.date}</td>
            <td>${h.time}</td>
            <td><span class="status ${h.status.toLowerCase()}">${h.status}</span></td>
            <td>${rating}</td>
            <td>
                ${h.status === 'Upcoming' ? '<button class="btn-sm cancel">Cancel</button>' : ''}
                ${h.status === 'Completed' && !h.rating ? '<button class="btn-sm review">Review</button>' : ''}
            </td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

// Ratings
function loadMyRatings() {
    const container = document.getElementById('ratingsList');
    if (!container) return;

    const ratings = [
        { museum: 'National Museum', rating: 5, comment: 'Amazing collection!', date: '2025-01-15' },
        { museum: 'Science Key', rating: 4, comment: 'Very interactive.', date: '2024-12-10' }
    ];

    if (ratings.length === 0) {
        document.getElementById('noRatings').style.display = 'block';
    } else {
        let html = '';
        ratings.forEach(r => {
            const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
            html += `
            <div class="booking-card">
                <h4>${r.museum}</h4>
                <div style="color: #D9A299; margin-bottom: 0.5rem;">${stars}</div>
                <p>"${r.comment}"</p>
                <small style="color: #666; display: block; margin-top: 0.5rem;">${r.date}</small>
            </div>`;
        });
        container.innerHTML = html;
    }
}

// Exhibitions
function loadExhibitions() {
    const container = document.getElementById('exhibits-container');
    if (!container) return;

    const exhibits = [
        { title: 'Ancient India', date: 'Jan 10 - Mar 20', image: '../../static/images/img1.jpg' },
        { title: 'Space Exploration', date: 'Feb 1 - Apr 15', image: '../../static/images/img2.jpg' },
        { title: 'Modern Art', date: 'Permanent', image: '../../static/images/img3.jpg' }
    ];

    let html = '';
    exhibits.forEach(e => {
        html += `
        <div class="trending-card">
            <img src="${e.image}" alt="${e.title}">
            <div class="trending-content">
                <h4>${e.title}</h4>
                <p><i class="fas fa-calendar"></i> ${e.date}</p>
                <button class="btn" style="width: 100%; margin-top: 10px; padding: 0.5rem;">View Details</button>
            </div>
        </div>`;
    });
    container.innerHTML = html;
}

// Popular Exhibits
function loadPopularExhibits() {
    const container = document.getElementById('popular-container');
    if (!container) return;

    const popular = [
        { name: 'The Dancing Girl', museum: 'National Museum', views: '1.2M' },
        { name: 'Ashoka Pillar', museum: 'Sarnath Museum', views: '900k' },
        { name: 'Mona Lisa (Replica)', museum: 'Art Gallery', views: '850k' }
    ];

    let html = '';
    popular.forEach(p => {
        html += `
        <div class="stat-card" style="text-align: left; border-bottom: 4px solid #D9A299;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <h3>${p.name}</h3>
                <span style="background: #F0E4D3; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem;">${p.views}</span>
            </div>
            <p>${p.museum}</p>
        </div>`;
    });
    container.innerHTML = html;
}

// AI Recommendations
function loadAIRecommendations() {
    const container = document.getElementById('aiRecommendations');
    if (!container) return;

    // Simulate AI response
    const recs = [
        { name: 'Heritage Transport Museum', match: '98%', reason: 'Based on your interest in Science' },
        { name: 'Partition Museum', match: '95%', reason: 'Recommended based on History preference' }
    ];

    let html = '';
    recs.forEach(r => {
        html += `
        <div class="recommendation-item">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <h4>${r.name}</h4>
                <span class="status status-confirmed">${r.match} Match</span>
            </div>
            <p style="color: #666; font-size: 0.9rem;">${r.reason}</p>
            <button class="btn" style="margin-top: 1rem; padding: 0.5rem 1rem; width: 100%;">View Details</button>
        </div>`;
    });
    container.innerHTML = html;
}

// Personalized Recommendations (Museum List)
function loadPersonalizedRecommendations() {
    const container = document.getElementById('museumList');
    if (!container) return;

    const museums = [
        { name: 'Local Art Centre', dist: '2.5 km', type: 'Art' },
        { name: 'City History Museum', dist: '5.0 km', type: 'History' }
    ];

    let html = '';
    museums.forEach(m => {
        html += `
        <div class="booking-card" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h4>${m.name}</h4>
                <p style="margin: 0;">${m.type} • ${m.dist}</p>
            </div>
            <button class="btn" style="padding: 0.5rem 1rem;">Directions</button>
        </div>`;
    });
    container.innerHTML = html;
}

// Initialize navigation
function initializeNavigation() {
    // Add smooth scrolling to all hash links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

// --- Foreign Visitors Chart Logic (Migrated from HTML) ---
let foreignChart = null;
let currentChartType = 'yearly';

function initForeignVisitorsChart() {
    const canvas = document.getElementById('foreignChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    loadYearlyData();

    // Chart controls
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const type = e.target.dataset.chart;
            if (type === 'yearly') loadYearlyData();
            else if (type === 'district') loadDistrictData();
            else if (type === 'monthly') loadMonthlyData();
        });
    });
}

function loadYearlyData() {
    // Mock data or fetch
    // Using mock for now to ensure UI works without backend
    const data = { '2023': 15000, '2024': 22000, '2025': 25000 };
    updateChart(Object.keys(data), Object.values(data), 'Yearly Foreign Visitors', 'line');
    document.getElementById('totalForeignVisitors').textContent = '62,000';
    document.getElementById('growthRate').textContent = '15%';
}

function loadDistrictData() {
    const data = { 'Delhi': 5000, 'Mumbai': 4000, 'Agra': 8000 };
    updateChart(Object.keys(data), Object.values(data), 'Top Districts', 'bar');
    const topDistrictEl = document.getElementById('topDistrict');
    if (topDistrictEl) topDistrictEl.textContent = 'Agra';
}

function loadMonthlyData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    const visitors = [1200, 1500, 1800, 2000, 2200];
    updateChart(months, visitors, 'Monthly Trends', 'line');
}

function updateChart(labels, data, title, type) {
    if (foreignChart) foreignChart.destroy();
    const ctx = document.getElementById('foreignChart').getContext('2d');
    foreignChart = new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: 'Visitors',
                data: data,
                backgroundColor: 'rgba(217, 162, 153, 0.5)', // Using new theme color
                borderColor: '#D9A299',
                borderWidth: 2,
                fill: type !== 'bar'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: title }
            }
        }
    });
}

// --- Museum Booking System Class ---
class MuseumBookingSystem {
    constructor() {
        this.init();
    }
    init() {
        // Initialize booking form logic
        const form = document.getElementById('bookingForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Booking Confirmed! (Demo)');
            });
        }

        // Populate inputs logic...
        this.setupFormListeners();
    }

    setupFormListeners() {
        const createSummaryUpdater = () => {
            // Update summary logic
            const museum = document.getElementById('museumSelect')?.value || '-';
            const date = document.getElementById('visitDate')?.value || '-';
            const people = document.getElementById('numPeople')?.value || 0;
            const total = people * 500; // Mock price
            document.getElementById('summaryMuseum').innerText = museum;
            document.getElementById('summaryDate').innerText = date;
            document.getElementById('summaryTotal').innerText = '₹' + total;
        };

        ['museumSelect', 'visitDate', 'numPeople'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', createSummaryUpdater);
        });
    }
}