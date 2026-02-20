// Tab switching
function switchTab(tabId) {
  document.querySelectorAll(".form").forEach(f => f.classList.remove("active"));
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");

  if (tabId === "login") {
    document.querySelectorAll(".tab")[0].classList.add("active");
  } else {
    document.querySelectorAll(".tab")[1].classList.add("active");
  }
}

// Register new admin
function registerAdmin() {
  const username = document.getElementById("regUser").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPass").value;
  const msgElement = document.getElementById("registerMsg");

  if (!username || !email || !password) {
    msgElement.textContent = "Please fill all fields.";
    return;
  }

  fetch('/api/auth/admin/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200) {
        msgElement.textContent = "Admin registered successfully";
        msgElement.style.color = "green";

        // Clear inputs
        document.getElementById("regUser").value = '';
        document.getElementById("regEmail").value = '';
        document.getElementById("regPass").value = '';

        setTimeout(() => {
          // Switch to login tab
          switchTab('login');
          // Pre-fill username
          document.getElementById("loginUser").value = username;
        }, 1500);
      } else {
        msgElement.textContent = body.error || "Registration failed";
        msgElement.style.color = "red";
      }
    })
    .catch(err => {
      console.error(err);
      msgElement.textContent = "Structure error occurred";
      msgElement.style.color = "red";
    });
}

// Login admin
function loginAdmin() {
  const username = document.getElementById("loginUser").value;
  const password = document.getElementById("loginPass").value;
  const msgElement = document.getElementById("loginMsg");

  if (!username || !password) {
    msgElement.textContent = "Please fill all fields.";
    return;
  }

  fetch('/api/auth/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200) {
        msgElement.textContent = "Login successful. Redirecting...";
        msgElement.style.color = "green";

        // Store user info if needed
        localStorage.setItem('adminUser', JSON.stringify(body.user));

        setTimeout(() => {
          window.location.href = "admin_dashboard.html";
        }, 1000);
      } else {
        msgElement.textContent = body.error || "Invalid credentials";
        msgElement.style.color = "red";
      }
    })
    .catch(err => {
      console.error(err);
      msgElement.textContent = "Login error occurred";
      msgElement.style.color = "red";
    });
}