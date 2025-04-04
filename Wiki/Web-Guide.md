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

```bash
docker-compose up
```

---

## 🌐 Running the Web Client

1. Go to the `Web/my-app` folder:

```bash
cd Web/my-app
```

2. Run:

```bash
npm install
npm start
```

---

# 👤 User Features

## 🧑‍💻 Registering and Logging In

### 📝 Register

<img width="900" alt="register-step-1" src="Wiki/Assets/430138107-23631b37-142f-44bb-8c9a-3cbe4a1fc4b3.png" />

1. Click **Get Started**.

<img width="900" alt="register-step-2" src="Wiki/Assets/430139902-421c5105-c674-4be0-a083-a9ce27e2bd79.png" />

2. Fill in the form and choose an avatar.  
3. Click **Sign Up**.

### 🔓 Login & Logout

<img width="900" alt="login" src="Wiki/Assets/login.png" />

1. Enter your email and password to log in.  
2. To log out, click the avatar icon → **LogOut**.

<img width="900" alt="logout" src="Wiki/Assets/logout.png" />

---

## 🎥 Viewing and Watching Movies

### Home Page

<img width="900" alt="home" src="Wiki/Assets/430179018-b353ec8c-bc48-4ac6-a513-0a8f0862da92.png" />

### Browse Movies by Category

<img width="900" alt="movies-page" src="Wiki/Assets/430180943-18383e34-ff36-4f71-b5f4-9d4bd6348dca.png" />

### View Movie Details

<img width="400" alt="movie-details" src="Wiki/Assets/movie-details.png" />

### Watch a Movie

<img width="900" alt="movie-play" src="Wiki/Assets/430181445-07834871-4985-48db-a5ad-e0b5ab976dc7.png" />

---

## 🌈 Extra Features for All Users

### Light/Dark Mode Toggle ☀️🌙

<img width="900" alt="dark-mode" src="Wiki/Assets/dark-mode.png" />

### Smart Search 🔍

<img width="900" alt="search" src="Wiki/Assets/search.png" />

### Personalized Recommendations 🤖

<img width="300" alt="recommendation" src="Wiki/Assets/recommendation.png" />

### Recently Watched 🕒

<img width="900" alt="recently-watched" src="Wiki/Assets/recently-watched.png" />

---

# 🔐 Admin Zone

## 🔑 Granting Admin Privileges

1. Sign out.

<img width="700" alt="signout" src="Wiki/Assets/signout.png" />

2. Open **MongoDB Compass**.  
3. Change the `manager` field of your user to `true`.

<img width="700" alt="mongodb-admin" src="Wiki/Assets/mongodb-admin.png" />

4. Sign in again – the **Admin** button should now be visible.

<img width="600" alt="admin-button" src="Wiki/Assets/430150002-2d18675f-d911-4c93-a5cc-67fdd8270ddd.png" />

---

## 🗂 Category Management

<img width="900" alt="categories" src="Wiki/Assets/categories.png" />

1. Go to **Admin Zone** → **Add Category**.  
2. Fill in name and description.  
3. You can also edit or delete categories.

<img width="700" alt="add-category" src="Wiki/Assets/add-category.png" />

---

## 🎬 Movie Management

1. Go to **Admin Zone** → **Add Movie**.  
2. Enter movie details.  
3. Upload a poster, trailer, and movie file.  
4. You can also edit or delete movies.

<img width="800" alt="add-movie" src="Wiki/Assets/add-movie.png" />
