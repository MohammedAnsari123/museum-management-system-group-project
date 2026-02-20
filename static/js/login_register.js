function showTab(tabId) {
    document.querySelectorAll(".form").forEach(f => f.classList.remove("active"));
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.getElementById(tabId).classList.add("active");
    if (tabId === "login") {
        document.querySelector(".tab:nth-child(1)").classList.add("active");
    } else if (tabId === "register") {
        document.querySelector(".tab:nth-child(2)").classList.add("active");
    }
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = this.username.value;
    const password = this.password.value;
    const msgElement = document.getElementById('loginMessage');

    fetch('/api/auth/visitor/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(({ status, body }) => {
            if (status === 200) {
                msgElement.textContent = 'Login successful!';
                msgElement.className = 'alert alert-success';
                msgElement.style.display = 'block';

                // Store user info
                localStorage.setItem('visitorUser', JSON.stringify(body.user));

                setTimeout(() => {
                    window.location.href = 'VisitorsHomePage.html';
                }, 1000);
            } else {
                msgElement.textContent = body.error || 'Login failed';
                msgElement.className = 'alert alert-error';
                msgElement.style.display = 'block';
            }
        })
        .catch(err => {
            console.error(err);
            msgElement.textContent = 'Network error occurred';
            msgElement.className = 'alert alert-error';
            msgElement.style.display = 'block';
        });
});

// Handle register form submission
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = this.username.value;
    const email = this.email.value;
    const password = this.password.value;
    const msgElement = document.getElementById('registerMessage');

    fetch('/api/auth/visitor/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(({ status, body }) => {
            if (status === 200) {
                msgElement.textContent = 'Registration successful! Please login.';
                msgElement.className = 'alert alert-success';
                msgElement.style.display = 'block';

                setTimeout(() => {
                    showTab('login');
                }, 1000);
            } else {
                msgElement.textContent = body.error || 'Registration failed';
                msgElement.className = 'alert alert-error';
                msgElement.style.display = 'block';
            }
        })
        .catch(err => {
            console.error(err);
            msgElement.textContent = 'Network error occurred';
            msgElement.className = 'alert alert-error';
            msgElement.style.display = 'block';
        });
});
