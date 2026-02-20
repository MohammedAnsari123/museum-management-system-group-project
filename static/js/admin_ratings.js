// admin_ratings.js
let page = 1;
let totalPages = 1;

async function fetchRatings() {
    const perPage = document.getElementById('perPage').value;
    const res = await fetch(`/api/admin/ratings?page=${page}&per_page=${perPage}`);
    const data = await res.json();
    const items = Array.isArray(data) ? data : (data.items || []);
    totalPages = data.total_pages || 1;

    // client-side basic filters
    const qMuseum = document.getElementById('qMuseum').value.trim().toLowerCase();
    const qEmail = document.getElementById('qEmail').value.trim().toLowerCase();
    const qTicket = document.getElementById('qTicket').value.trim().toLowerCase();

    const filtered = items.filter(r => {
        const m = (r.Museum || '').toLowerCase();
        const e = (r.VisitorEmail || '').toLowerCase();
        const t = (r.TicketID || '').toLowerCase();
        return (!qMuseum || m.includes(qMuseum)) && (!qEmail || e.includes(qEmail)) && (!qTicket || t.includes(qTicket));
    });

    renderList(filtered);
    const pageInfo = document.getElementById('pageInfo');
    if (pageInfo) pageInfo.textContent = `Page ${data.page || page} of ${totalPages}`;

    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) prevBtn.disabled = (data.page || page) <= 1;

    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.disabled = (data.page || page) >= totalPages;
}

function renderList(items) {
    const list = document.getElementById('ratingsList');
    if (!items.length) {
        list.innerHTML = '<div class="admin-card">No ratings found.</div>';
        return;
    }
    list.innerHTML = items.map(r => {
        const rating = parseInt(r.Rating) || 0;
        const stars = '★'.repeat(Math.max(0, Math.min(5, rating))) + '☆'.repeat(Math.max(0, 5 - rating));
        const date = r.Date || '-';
        const time = r.Time || '-';
        const name = r.VisitorName || '-';
        const email = r.VisitorEmail || '-';
        return `
      <div class="admin-card">
        <div class="rating-header">
          <strong>${r.Museum || '-'}</strong>
          <span class="rating-stars">${stars}</span>
        </div>
        <div class="rating-meta">
          <span>Ticket: ${r.TicketID || '-'}</span>
          <span>${date} ${time}</span>
          <span>${name}</span>
          <span>${email}</span>
        </div>
        ${r.Review ? `<div class="rating-review">${r.Review}</div>` : ''}
      </div>
    `;
    }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('prevBtn').addEventListener('click', () => { if (page > 1) { page--; fetchRatings(); } });
    document.getElementById('nextBtn').addEventListener('click', () => { if (page < totalPages) { page++; fetchRatings(); } });
    document.getElementById('perPage').addEventListener('change', () => { page = 1; fetchRatings(); });
    document.getElementById('qMuseum').addEventListener('input', () => { fetchRatings(); });
    document.getElementById('qEmail').addEventListener('input', () => { fetchRatings(); });
    document.getElementById('qTicket').addEventListener('input', () => { fetchRatings(); });

    fetchRatings();
});
