// Load analytics data
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/admin/analytics')
        .then(response => response.json())
        .then(data => {
            displayBookingStats(data.booking_stats);
            displayMuseumStats(data.museum_stats);
            createVisitorChart(data.booking_stats);
            createMuseumTypeChart(data.museum_stats);
        })
        .catch(error => {
            console.log('Error loading analytics:', error);
        });

    // Load foreign visitors data
    fetch('/api/foreign-visitors')
        .then(response => response.json())
        .then(data => {
            createForeignVisitorsChart(data);
        })
        .catch(error => {
            console.log('Error loading foreign visitors data:', error);
        });

    // Load district-wise foreign visitors data
    fetch('/api/foreign-visitors-by-district')
        .then(response => response.json())
        .then(data => {
            createDistrictChart(data);
        })
        .catch(error => {
            console.log('Error loading district data:', error);
        });

    // Back button logic
    const backBtn = document.querySelector('.btn-light');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'admin_dashboard.html';
        });
    }
});

function displayBookingStats(stats) {
    const container = document.getElementById('bookingStats');
    if (!container) return;
    container.innerHTML = `
        <p><strong>Total Bookings:</strong> ${stats.total_bookings || 0}</p>
        <p><strong>Attended Bookings:</strong> ${stats.attended_bookings || 0}</p>
        <p><strong>Average Rating:</strong> ${(stats.avg_rating || 0).toFixed(2)}</p>
    `;
}

function displayMuseumStats(stats) {
    const container = document.getElementById('museumStats');
    if (!container) return;
    const entries = Object.entries(stats.museums_by_type || {});
    if (!entries.length) {
        container.innerHTML = `
            <p><strong>Total Museums:</strong> ${stats.total_museums || 0}</p>
            <p>No museum type data available.</p>
        `;
        return;
    }

    let tableHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Museum Type</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody>
                ${entries.map(([type, count]) => `
                    <tr>
                        <td>${type}</td>
                        <td>${count}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = `
        <p><strong>Total Museums:</strong> ${stats.total_museums || 0}</p>
        <div class="mt-2"><strong>Museums by Type</strong></div>
        ${tableHTML}
    `;
}

function createVisitorChart(stats) {
    const ctx = document.getElementById('visitorChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Bookings', 'Attended'],
            datasets: [{
                label: 'Bookings',
                data: [stats.total_bookings || 0, stats.attended_bookings || 0],
                backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)'],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createMuseumTypeChart(stats) {
    const ctx = document.getElementById('museumTypeChart').getContext('2d');
    const labels = Object.keys(stats.museums_by_type || {});
    const data = Object.values(stats.museums_by_type || {});

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 205, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

function createForeignVisitorsChart(data) {
    const ctx = document.getElementById('foreignVisitorsChart').getContext('2d');
    const years = Object.keys(data).sort();
    const visitors = years.map(year => data[year]);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Foreign Visitors',
                data: visitors,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 3,
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Visitors'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Foreign Visitors Trend (2014-2024)'
                }
            }
        }
    });
}

function createDistrictChart(data) {
    const ctx = document.getElementById('districtChart').getContext('2d');
    const districts = data.map(item => item.District);
    const visitors = data.map(item => item.TotalVisitors);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: districts,
            datasets: [{
                label: 'Total Foreign Visitors',
                data: visitors,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Visitors'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'District'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Top 10 Districts by Foreign Visitors'
                }
            }
        }
    });
}
