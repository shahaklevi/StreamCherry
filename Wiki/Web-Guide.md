# 🍒 StreamCherry – Web Guide

---

## 📑 Table of Contents

- [⚙️ Running the Server](#️-running-the-server)
- [🌐 Running the Web Client](#-running-the-web-client)

### 👤 User Features
- [🧑‍💻 Registering and Logging In](#-registering-and-logging-in)
  - [📝 Register](#-register)
  - [🔓 Login & Logout](#-login--logout)
- [🎥 Viewing and Watching Movies](#-viewing-and-watching-movies)
- [🌈 Extra Features for All Users](#-extra-features-for-all-users)

### 🔐 Admin Features
- [🔑 Granting Admin Privileges](#-granting-admin-privileges)
- [🗂 Category Management](#-category-management)
- [🎬 Movie Management](#-movie-management)

---

## ⚙️ Running the Server

1. Open a terminal in the server directory.  
2. Run:

bash
docker-compose up


---

## 🌐 Running the Web Client

1. Go to the Web/my-app folder:

bash
cd Web/my-app


2. Run:

bash
npm install
npm start


---

# 👤 User Features

## 🧑‍💻 Registering and Logging In

### 📝 Register

<img width="900" alt="register-step-1" src="Assets/430138107-23631b37-142f-44bb-8c9a-3cbe4a1fc4b3.png" />

1. Click **Get Started**.

<img width="900" alt="register-step-2" src="Assets/430139902-421c5105-c674-4be0-a083-a9ce27e2bd79.png" />

2. Fill in the form and choose an avatar.  
3. Click **Sign Up**.

### 🔓 Login & Logout

<img width="900" alt="login" src="Assets/430141590-68f812e7-0b8a-4119-961c-8a4ebe547db6.png" />

1. Enter your email and password to log in.  
2. To log out, click the avatar icon → **LogOut**.

<img width="900" alt="logout" src="Assets/430142608-512e4cef-043e-478d-9240-c503c2aab5d3.png" />

---

## 🎥 Viewing and Watching Movies

### Home Page

<img width="900" alt="home" src="Assets/430179018-b353ec8c-bc48-4ac6-a513-0a8f0862da92.png" />

### Browse Movies by Category

<img width="900" alt="movies-page" src="Assets/430180943-18383e34-ff36-4f71-b5f4-9d4bd6348dca.png" />

### View Movie Details

<img width="400" alt="movie-details" src="Assets/430179991-57192e8f-e29c-469e-a237-e9710cef6aa1.png" />

### Watch a Movie

<img width="900" alt="movie-play" src="Assets/430181445-07834871-4985-48db-a5ad-e0b5ab976dc7.png" />

---

## 🌈 Extra Features for All Users

### Light/Dark Mode Toggle ☀️🌙

<img width="900" alt="dark-mode" src="Assets/430178911-d8980499-ef8f-46e4-83a2-5ace20bd5df3.png" />

### Smart Search 🔍

<img width="900" alt="search" src="Assets/430178874-812d93f4-22ad-4fb4-a8d0-90b992a43bf6.png" />

### Personalized Recommendations 🤖

<img width="300" alt="recommendation" src="Assets/430178539-040060cc-aae2-4636-b01f-e68b6a273466.png" />

### Recently Watched 🕒

<img width="900" alt="recently-watched" src="Assets/430178798-f309501e-3231-41cf-b12c-2b801d25ada4.png" />

---

# 🔐 Admin Zone

## 🔑 Granting Admin Privileges

1. Sign out.

<img width="700" alt="signout" src="Assets/430144939-bdf0a44d-c83a-42cd-9c16-143e28aaaf2e.png" />

2. Open **MongoDB Compass**.  
3. Change the manager field of your user to true.

<img width="700" alt="mongodb-admin" src="Assets/430145607-967d9a18-8af8-413a-bffb-68adf1d6c676.png" />

4. Sign in again – the **Admin** button should now be visible.

<img width="600" alt="admin-button" src="Assets/430150002-2d18675f-d911-4c93-a5cc-67fdd8270ddd-2.png" />

---

## 🗂 Category Management

<img width="900" alt="categories" src="Assets/430147020-a71d98ec-8abb-4f94-9a0b-b3aa0d378346-2.png" />

1. Go to **Admin Zone** → **Add Category**.  
2. Fill in name and description.  
3. You can also edit or delete categories.

<img width="700" alt="add-category" src="Assets/430147020-a71d98ec-8abb-4f94-9a0b-b3aa0d378346-2.png" />

---

## 🎬 Movie Management

1. Go to **Admin Zone** → **Add Movie**.  
2. Enter movie details.  
3. Upload a poster, trailer, and movie file.  
4. You can also edit or delete movies.

<img width="800" alt="add-movie" src="Assets/430175122-7ed27e4a-b63d-482c-b308-d0c2c5eae866-2.png" />
