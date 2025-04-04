# 🎥 Full-Stack Movie Streaming & Recommendation Platform

## 📌 Contents
- [Introduction](#introduction)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Client Capabilities](#client-capabilities)

---

## 🧾 Introduction
This project is a complete full-stack solution for streaming and recommending movies, designed with a **client-server architecture**.

The **backend** (Node.js) provides a secure RESTful API, manages user authentication via JWT, interacts with a MongoDB database, and supports a recommendation mechanism.

The **frontend** includes:
- A **React web application** for users to explore and manage movie content.
- An **Android application** offering a mobile-friendly interface with similar features.

Both platforms include support for **Dark and Light themes**, with user preferences stored persistently.

---

## 🏛️ Architecture

### 🔙 Backend (Node.js + Express)
- RESTful API for handling movies, users, categories, and recommendations.
- Authentication and session management using **JWT**.
- Data stored in **MongoDB**.
- Efficient handling of concurrent requests using a multithreaded architecture.

### 🖥️ Web Client (React)
- Communicates with the backend using native `fetch()` calls.
- Offers features such as login/registration, browsing, searching, and movie previews.
- Theme toggle (Dark/Light) managed through `localStorage`.

### 📱 Mobile Client (Android - Java)
- API communication handled via **Retrofit**.
- UI includes login, registration, movie browsing, detailed views, and playback.
- Theme preferences stored using Android’s `SharedPreferences`.

---

## 🔗 API Endpoints

### 👤 User Authentication
- `POST /api/users` — Register new users with profile info.
- `POST /api/tokens` — Authenticate users and receive a JWT token.
- `GET /api/users/:id` — Fetch user details (protected).

> All protected endpoints require the token to be included in the request header.

### 🎞️ Movie Management
- `GET /api/movies` — Retrieve movies by category.
- `GET /api/movies/allmovies` — Fetch all available movies.
- `POST /api/movies` — Add a new movie.
- `GET /api/movies/:id` — View detailed movie information.
- `PUT /api/movies/:id` — Update movie information.
- `DELETE /api/movies/:id` — Remove a movie.

### 🗂️ Category Management
- `GET /api/categories` — Fetch all categories.
- `POST /api/categories` — Create a new category.
- `GET /api/categories/:id` — Get details of a specific category.
- `PATCH /api/categories/:id` — Edit a category.
- `DELETE /api/categories/:id` — Delete a category.

### 🎯 Recommendations & Search
- `GET /api/movies/:id/recommend` — Get recommended movies.
- `POST /api/movies/:id/recommend` — Add movie to watched list.
- `GET /api/movies/search/:query` — Search movies by keyword.

---

## 💡 Client Capabilities

### 🖼️ Available Screens
- **Welcome Screen** — Landing page for visitors.
- **Login / Register** — Secure forms with input validation and image upload.
- **Main Dashboard** — Displays all movies available to the user.
- **Movie Details View** — In-depth info and related recommendations.
- **Movie Player** — Integrated video player for streaming.
- **Search Results** — Search UI with dynamic filtering.
- **Admin Dashboard** — Role-based access to content management tools.

### 🛡️ Access Control
- **Public:** Welcome, login, and registration pages.
- **User:** Full access to dashboard, search, and playback.
- **Admin:** Extended access to create/edit/delete movies and categories.

### 🎨 Theme Mode
- Users can toggle between **Dark** and **Light** themes.
- Preferences are saved using `localStorage` (web) or `SharedPreferences` (Android).
- Accessible via the top navigation bar.

---

## 📦 **Setup & Deployment Instructions**

Instructions for running and deploying the application (both server and clients) can be found in the  
👉 [`RunningApp.md`](RunningApp.md)
## 📦 **Docomentation Web & Android**

Instructions for running and deploying the application (both server and clients) can be found in the
👉 [`Web-Guide.md`](Web-Guide.md)
👉 [`Android-Guide.md`](Android-Guide.md)

---
