/* 
  Admin Dashboard Logic 
  - Handles navigation via data-link attributes
*/

document.addEventListener('DOMContentLoaded', () => {
    // Handle all elements with data-link attribute
    const linkedElements = document.querySelectorAll('[data-link]');

    linkedElements.forEach(el => {
        el.addEventListener('click', (e) => {
            const url = el.getAttribute('data-link');

            // Handle Logout
            if (el.classList.contains('logout-btn')) {
                e.preventDefault(); // Prevent immediate redirect if any
                fetch('/api/auth/logout', { method: 'POST' })
                    .then(() => {
                        window.location.href = url; // Redirect to auth page after logout
                    })
                    .catch(err => console.error('Logout failed', err));
                return;
            }

            if (url) {
                window.location.href = url;
            }
        });
    });

    // Add hover effects for cards via JS if needed, though CSS is preferred.
    // CSS handles hover effects in admin_style.css
});
