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

<img width="900" alt="logout" src="https://github.com/user-attachments/assets/512e4cef-043e-478d-9240-c503c2aab5d3" />

---

## 🎥 Viewing and Watching Movies

### Home Page

<img width="900" alt="home" src="https://github.com/user-attachments/assets/b353ec8c-bc48-4ac6-a513-0a8f0862da92" />

### Browse Movies by Category

<img width="900" alt="movies-page" src="https://github.com/user-attachments/assets/18383e34-ff36-4f71-b5f4-9d4bd6348dca" />

### View Movie Details

<img width="400" alt="movie-details" src="https://github.com/user-attachments/assets/57192e8f-e29c-469e-a237-e9710cef6aa1" />

### Watch a Movie

<img width="900" alt="movie-play" src="https://github.com/user-attachments/assets/07834871-4985-48db-a5ad-e0b5ab976dc7" />

---

## 🌈 Extra Features for All Users

### Light/Dark Mode Toggle ☀️🌙

<img width="900" alt="dark-mode" src="https://github.com/user-attachments/assets/d8980499-ef8f-46e4-83a2-5ace20bd5df3" />

### Smart Search 🔍

<img width="900" alt="search" src="https://github.com/user-attachments/assets/812d93f4-22ad-4fb4-a8d0-90b992a43bf6" />

### Personalized Recommendations 🤖

<img width="300" alt="recommendation" src="https://github.com/user-attachments/assets/040060cc-aae2-4636-b01f-e68b6a273466" />

### Recently Watched 🕒

<img width="900" alt="recently-watched" src="https://github.com/user-attachments/assets/f309501e-3231-41cf-b12c-2b801d25ada4" />

---

# 🔐 Admin Zone

## 🔑 Granting Admin Privileges

1. Sign out.

<img width="700" alt="signout" src="https://github.com/user-attachments/assets/bdf0a44d-c83a-42cd-9c16-143e28aaaf2e" />

2. Open **MongoDB Compass**.  
3. Change the manager field of your user to true.

<img width="700" alt="mongodb-admin" src="https://github.com/user-attachments/assets/967d9a18-8af8-413a-bffb-68adf1d6c676" />

4. Sign in again – the **Admin** button should now be visible.

<img width="600" alt="admin-button" src="https://github.com/user-attachments/assets/2d18675f-d911-4c93-a5cc-67fdd8270ddd" />

---

## 🗂 Category Management

<img width="900" alt="categories" src="https://github.com/user-attachments/assets/a71d98ec-8abb-4f94-9a0b-b3aa0d378346" />

1. Go to **Admin Zone** → **Add Category**.  
2. Fill in name and description.  
3. You can also edit or delete categories.

<img width="700" alt="add-category" src="https://github.com/user-attachments/assets/70806482-e620-4cf1-bc5b-9d6452bd7e0e" />

---

## 🎬 Movie Management

1. Go to **Admin Zone** → **Add Movie**.  
2. Enter movie details.  
3. Upload a poster, trailer, and movie file.  
4. You can also edit or delete movies.

<img width="800" alt="add-movie" src="https://github.com/user-attachments/assets/7ed27e4a-b63d-482c-b308-d0c2c5eae866" />
