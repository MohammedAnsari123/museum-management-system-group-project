# 🏛️ PixelPast — Museum Management System

A full-stack Museum Management System built with **Flask**, **MongoDB**, and a local **LLM-powered chatbot**. It features visitor authentication, museum gallery browsing, tour booking, interactive maps, analytics dashboards, and an AI museum guide chatbot.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Setup & Installation](#-setup--installation)
- [Download the LLM Model](#-download-the-llm-model)
- [Seed the Database](#-seed-the-database)
- [Run the Application](#-run-the-application)
- [Project Structure](#-project-structure)
- [Features](#-features)

---

## 🛠️ Tech Stack

| Layer       | Technology                                   |
|-------------|----------------------------------------------|
| Backend     | Python, Flask                                |
| Database    | MongoDB                                      |
| Frontend    | HTML, CSS, JavaScript                        |
| AI Chatbot  | Phi-3-mini (GGUF) via `llama-cpp-python`     |
| Maps        | Leaflet.js                                   |
| Charts      | Chart.js                                     |

---

## ✅ Prerequisites

Make sure you have the following installed before starting:

1. **Python 3.10+** — [Download Python](https://www.python.org/downloads/)
2. **MongoDB** — [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Make sure MongoDB is **running** on `localhost:27017` (default port)
3. **Git** — [Download Git](https://git-scm.com/downloads)
4. **pip** — Comes with Python, but update it: `python -m pip install --upgrade pip`

---

## 🚀 Setup & Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Museum-Management-System
```

### 2. Create a Virtual Environment (Recommended)

```bash
python -m venv venv
```

Activate it:

- **Windows:**
  ```bash
  venv\Scripts\activate
  ```
- **macOS/Linux:**
  ```bash
  source venv/bin/activate
  ```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

> **Note:** `llama-cpp-python` may take a few minutes to install as it compiles C++ code. If you have a compatible NVIDIA GPU and want GPU acceleration, install with:
> ```bash
> CMAKE_ARGS="-DLLAMA_CUBLAS=on" pip install llama-cpp-python
> ```

---

## 🤖 Download the LLM Model

The chatbot uses **Microsoft Phi-3-mini** (quantized GGUF format, ~2.4 GB). The model is **not included** in the repository due to its size. You must download it before using the chatbot.

### Option A: Using the download script (Recommended)

```bash
python download_model.py
```

This will automatically download `Phi-3-mini-4k-instruct-q4.gguf` into the `models/` folder.

### Option B: Manual download

1. Go to [microsoft/Phi-3-mini-4k-instruct-gguf](https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf) on Hugging Face
2. Download the file: **`Phi-3-mini-4k-instruct-q4.gguf`**
3. Place it in the `models/` folder:
   ```
   Museum-Management-System/
   └── models/
       └── Phi-3-mini-4k-instruct-q4.gguf
   ```

> **Note:** The download is approximately **2.4 GB**. Make sure you have a stable internet connection.

---

## 🌱 Seed the Database

To populate the database with sample museums, bookings, and ratings:

```bash
python seed.py
```

This will insert sample data into the `miuzeum_db` MongoDB database only if the collections are empty.

---

## ▶️ Run the Application

```bash
python main.py
```

The server will start on **http://localhost:5000**

### Pages:

| Page | URL |
|------|-----|
| Home (Landing Page) | http://localhost:5000/ |
| Visitor Login | http://localhost:5000/visitor/visitor_login.html |
| Visitor Dashboard | http://localhost:5000/visitor/VisitorsHomePage.html |
| Museum Gallery | http://localhost:5000/visitor/gallery.html |
| Museum Map | http://localhost:5000/visitor/museum_map.html |
| AI Chatbot | http://localhost:5000/visitor/chatbot.html |
| Admin Login | http://localhost:5000/admin/admin_auth.html |
| Admin Dashboard | http://localhost:5000/admin/admin_dashboard.html |

---

## 📁 Project Structure

```
Museum-Management-System/
├── main.py                  # Flask app entry point & API routes
├── db.py                    # MongoDB connection & collections
├── seed.py                  # Database seeder with sample data
├── download_model.py        # Script to download the LLM model
├── requirements.txt         # Python dependencies
├── .gitignore               # Git ignore rules
│
├── routes/
│   ├── auth_routes.py       # Authentication (login, register, password reset)
│   └── chatbot_routes.py    # AI chatbot API (Phi-3 LLM)
│
├── models/                  # LLM model files (not tracked by git)
│   └── Phi-3-mini-4k-instruct-q4.gguf
│
├── templates/
│   ├── index.html           # Landing page
│   ├── visitor/             # Visitor-facing pages
│   │   ├── VisitorsHomePage.html
│   │   ├── gallery.html
│   │   ├── chatbot.html
│   │   ├── museum_map.html
│   │   ├── visitor_login.html
│   │   ├── visitor_register.html
│   │   ├── forgot_password.html
│   │   └── reset_password.html
│   └── admin/               # Admin panel pages
│       ├── admin_auth.html
│       ├── admin_dashboard.html
│       ├── manage_exhibits.html
│       ├── manage_bookings.html
│       ├── analytics.html
│       ├── admin_ratings.html
│       └── ml_modules.html
│
└── static/
    ├── css/                 # Stylesheets
    ├── js/                  # JavaScript files
    ├── images/              # Static images
    └── museum_images/       # Museum photo collection
```

---

## ✨ Features

- **Visitor Authentication** — Register, login, forgot/reset password
- **Admin Authentication** — Separate admin login and registration
- **Museum Gallery** — Browse museums with search and filter (by type, location)
- **Tour Booking** — Book museum tours with date, time, and tour type selection
- **Interactive Map** — Explore museums across India using Leaflet.js
- **AI Chatbot** — Ask questions about museums and history (powered by Phi-3 LLM)
- **Analytics Dashboard** — View visitor statistics and charts (Chart.js)
- **Ratings & Reviews** — Rate and review visited museums
- **Admin Panel** — Manage exhibits, bookings, ratings, and view analytics

---

## 📝 License

This project is developed as a **Diploma Final Year Project**.
