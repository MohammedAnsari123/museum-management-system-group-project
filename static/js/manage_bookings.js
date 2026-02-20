// manage_bookings.js

document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('#bookingsTable tbody');
    const searchInput = document.getElementById('search');
    const refreshBtn = document.getElementById('refresh');
    const countEl = document.getElementById('count');

    let rows = [];

    function statusBadge(value) {
        const v = (value || '').toString().trim();
        let cls = 'badge ';
        if (v === 'Yes') cls += 'badge-yes';
        else if (v === 'Cancelled') cls += 'badge-cancelled';
        else cls += 'badge-no';
        return `<span class="${cls}">${v || 'No'}</span>`;
    }

    function actionCell(ticketId, current) {
        const options = ['Yes', 'No', 'Cancelled'];
        const opts = options.map(o => `<option value="${o}" ${o === current ? 'selected' : ''}>${o}</option>`).join('');
        return `
    <div class="action-cell-container">
      <select class="status-select" data-ticket="${ticketId}">${opts}</select>
      <button class="btn btn-primary" data-update="${ticketId}">Update</button>
    </div>
  `;
    }

    function render(data) {
        tbody.innerHTML = '';
        data.forEach(b => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
      <td>${b.TicketID || ''}</td>
      <td>${b.Museum || ''}</td>
      <td>${b.Date || ''}</td>
      <td>${b.Time || ''}</td>
      <td>${b.People || ''}</td>
      <td>${b.TourType || ''}</td>
      <td>${b.VisitorName || ''}</td>
      <td>${b.VisitorEmail || ''}${b.VisitorPhone ? ' / ' + b.VisitorPhone : ''}</td>
      <td>${statusBadge(b.Attended)}</td>
      <td>${actionCell(b.TicketID, b.Attended)}</td>
    `;
            tbody.appendChild(tr);
        });
        countEl.textContent = `${data.length} booking(s)`;
    }

    async function load() {
        try {
            const res = await fetch('/api/admin/bookings');
            const data = await res.json();
            if (Array.isArray(data)) {
                rows = data;
                render(rows);
            } else {
                tbody.innerHTML = `<tr><td colspan="10">Failed to load bookings</td></tr>`;
            }
        } catch (e) {
            tbody.innerHTML = `<tr><td colspan="10">Error loading bookings</td></tr>`;
        }
    }

    function doFilter() {
        const q = searchInput.value.toLowerCase();
        if (!q) { render(rows); return; }
        const filtered = rows.filter(b => [
            b.TicketID, b.Museum, b.VisitorName, b.VisitorEmail, b.TourType
        ].map(x => (x || '').toString().toLowerCase()).some(s => s.includes(q)));
        render(filtered);
    }

    tbody.addEventListener('click', async (e) => {
        const btn = e.target.closest('button[data-update]');
        if (!btn) return;
        const id = btn.getAttribute('data-update');
        const sel = tbody.querySelector(`select[data-ticket="${id}"]`);
        const status = sel ? sel.value : '';
        btn.disabled = true; btn.textContent = 'Saving...';
        try {
            const res = await fetch(`/api/admin/bookings/${id}/status`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (res.ok) {
                // update local row
                rows = rows.map(r => r.TicketID === id ? { ...r, Attended: status } : r);
                doFilter();
            } else {
                alert(data && data.error ? data.error : 'Failed to update');
            }
        } catch (err) {
            alert('Network error while updating');
        } finally {
            btn.disabled = false; btn.textContent = 'Update';
        }
    });

    searchInput.addEventListener('input', doFilter);
    refreshBtn.addEventListener('click', load);

    load();
});
