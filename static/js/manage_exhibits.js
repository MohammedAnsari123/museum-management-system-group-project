// manage_exhibits.js
// Pagination state
const adminMuseumsState = { page: 1, per_page: 10, total_pages: 1, total: 0, items: [] };

let map, marker, latInput, lonInput;

document.addEventListener('DOMContentLoaded', () => {
    // Map + Lat/Lon sync
    latInput = document.getElementById('m_lat');
    lonInput = document.getElementById('m_lon');
    map = L.map('m_map').setView([20.5937, 78.9629], 5); // India default
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        latInput.value = lat.toFixed(6);
        lonInput.value = lng.toFixed(6);
        setMarker(lat, lng);
    });

    latInput.addEventListener('change', () => {
        const lat = parseFloat(latInput.value);
        const lon = parseFloat(lonInput.value);
        if (Number.isFinite(lat) && Number.isFinite(lon)) setMarker(lat, lon);
    });

    lonInput.addEventListener('change', () => {
        const lat = parseFloat(latInput.value);
        const lon = parseFloat(lonInput.value);
        if (Number.isFinite(lat) && Number.isFinite(lon)) setMarker(lat, lon);
    });

    // Form Submit
    document.getElementById('addMuseumForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            Name: document.getElementById('m_name').value,
            City: document.getElementById('m_city').value,
            State: document.getElementById('m_state').value,
            Type: document.getElementById('m_type').value,
            Established: document.getElementById('m_est').value,
        };
        const latV = parseFloat(latInput.value);
        const lonV = parseFloat(lonInput.value);
        if (Number.isFinite(latV) && Number.isFinite(lonV)) {
            payload.Latitude = latV;
            payload.Longitude = lonV;
        }
        try {
            const res = await fetch('/api/admin/museums', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create');
            // Refresh current page to reflect changes
            fetchMuseums(1);
            e.target.reset();
            if (marker) { marker.remove(); marker = null; }
        } catch (err) {
            document.getElementById('museumError').textContent = err.message || 'Error creating museum';
        }
    });

    // Initial load
    fetchMuseums(1);
});

function setMarker(lat, lon) {
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
    if (marker) {
        marker.setLatLng([lat, lon]);
    } else {
        marker = L.marker([lat, lon], { draggable: true }).addTo(map);
        marker.on('dragend', (e) => {
            const { lat, lng } = e.target.getLatLng();
            latInput.value = lat.toFixed(6);
            lonInput.value = lng.toFixed(6);
        });
    }
}

async function fetchMuseums(page = 1) {
    const list = document.getElementById('museumList');
    const pager = document.getElementById('museumPager');
    const errBox = document.getElementById('museumError');
    errBox.textContent = '';
    list.innerHTML = 'Loading...';
    pager.innerHTML = '';
    try {
        const res = await fetch(`/api/admin/museums?page=${page}&per_page=${adminMuseumsState.per_page}`);
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(payload.error || 'Failed to load');
        // Support legacy non-paginated response
        if (Array.isArray(payload)) {
            adminMuseumsState.items = payload;
            adminMuseumsState.page = 1;
            adminMuseumsState.total = payload.length;
            adminMuseumsState.total_pages = 1;
        } else {
            adminMuseumsState.items = payload.items || [];
            adminMuseumsState.page = payload.page || page;
            adminMuseumsState.per_page = payload.per_page || adminMuseumsState.per_page;
            adminMuseumsState.total = payload.total || adminMuseumsState.items.length;
            adminMuseumsState.total_pages = payload.total_pages || 1;
        }
        renderMuseums();
        renderMuseumsPager();
    } catch (e) {
        list.innerHTML = '';
        errBox.textContent = e.message || 'Error loading museums';
    }
}

function renderMuseums() {
    const list = document.getElementById('museumList');
    list.innerHTML = '';
    adminMuseumsState.items.forEach((m) => {
        const li = document.createElement('li');
        const label = `${m.Name || ''} - ${m.Type || ''} (${m.City || ''}${m.State ? ', ' + m.State : ''}) ${m.Established ? '• Est. ' + m.Established : ''}`;
        li.innerHTML = `
            <strong>${label}</strong>
            <button class="btn btn-ghost" onclick="onEditMuseum('${m.id}')">Edit</button>
            <button class="btn btn-danger" onclick="onDeleteMuseum('${m.id}')">Delete</button>
        `;
        list.appendChild(li);
    });
}

function renderMuseumsPager() {
    const pager = document.getElementById('museumPager');
    pager.innerHTML = '';
    const { page, total_pages } = adminMuseumsState;
    const mkBtn = (label, p, disabled = false, active = false) => {
        const b = document.createElement('button');
        b.textContent = label;
        b.disabled = disabled;
        if (active) b.classList.add('active');
        b.className = 'btn btn-light';
        b.addEventListener('click', () => fetchMuseums(p));
        return b;
    };
    pager.appendChild(mkBtn('Prev', page - 1, page === 1));
    const maxVisible = 3;
    const pages = [];
    if (total_pages <= 6) {
        for (let i = 1; i <= total_pages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (page > maxVisible) pages.push('...');
        const s = Math.max(2, page - 1);
        const e = Math.min(total_pages - 1, page + 1);
        for (let i = s; i <= e; i++) pages.push(i);
        if (page + 1 < total_pages - 1) pages.push('...');
        pages.push(total_pages);
    }
    pages.forEach(p => {
        if (p === '...') {
            const span = document.createElement('span');
            span.textContent = '...';
            pager.appendChild(span);
        } else {
            pager.appendChild(mkBtn(String(p), p, false, p === page));
        }
    });
    pager.appendChild(mkBtn('Next', page + 1, page === total_pages));
}

async function onDeleteMuseum(id) {
    if (!confirm('Delete this museum?')) return;
    try {
        const res = await fetch(`/api/admin/museums/${id}`, { method: 'DELETE' });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Failed to delete');
        fetchMuseums(adminMuseumsState.page);
    } catch (err) {
        alert(err.message || 'Error deleting museum');
    }
}

// Make globally available for onclick
window.onDeleteMuseum = onDeleteMuseum;

async function onEditMuseum(id) {
    const m = adminMuseumsState.items.find(x => x.id === id);
    if (!m) return;
    const Name = prompt('Name:', m.Name || '') || '';
    const City = prompt('City:', m.City || '') || '';
    const State = prompt('State:', m.State || '') || '';
    const Type = prompt('Type:', m.Type || '') || '';
    const Established = prompt('Established:', m.Established || '') || '';
    const LatStr = prompt('Latitude (decimal):', (m.Latitude ?? '').toString()) || '';
    const LonStr = prompt('Longitude (decimal):', (m.Longitude ?? '').toString()) || '';
    const payload = { Name, City, State, Type, Established };
    const latNum = parseFloat(LatStr);
    const lonNum = parseFloat(LonStr);
    if (Number.isFinite(latNum) && Number.isFinite(lonNum)) {
        payload.Latitude = latNum;
        payload.Longitude = lonNum;
    }
    try {
        const res = await fetch(`/api/admin/museums/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update');
        fetchMuseums(adminMuseumsState.page);
    } catch (err) {
        alert(err.message || 'Error updating museum');
    }
}
window.onEditMuseum = onEditMuseum;
