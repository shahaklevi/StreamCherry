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
- [🗂 Managing Categories](#-managing-categories)
- [🎬 Adding Movies](#-adding-movies)
- [✏️ Editing & Managing Movies](#-editing--managing-movies)

---

## ⚙️ Running the Server

1. Open a terminal in the server directory.  
2. Run:

```powershell
$env:WEB_PORT="4000"; $env:RECOMMEND_PORT="7000"; docker-compose up --build
```

🖼️ **Screenshot idea:** Terminal showing Docker successfully building and running the containers.

---

## 🌐 Running the Web Client

1. Go to the `web-client` folder.  
2. Run:

```bash
npm start
```

🖼️ **Screenshot idea:** Web app landing page open in the browser.

---

# 👤 User Features

## 🧑‍💻 Registering and Logging In

### 📝 Register

1. Click **Sign Up**.  
2. Fill in the form and choose an avatar.  
3. Click **Submit**.

🖼️ **Screenshot idea:** Filled registration form and success confirmation.

### 🔓 Login & Logout

1. To log in, use your registered email and password.  
2. To log out, click the avatar icon → **Sign Out**.  
3. You can then register a new user or sign in again.

🖼️ **Screenshot idea:** Sign in form and logout option in avatar menu.

---

## 🎥 Viewing and Watching Movies

1. After logging in, the **main page** displays movies sorted by promoted categories.
2. Click a category to view all related movies.
3. Use the **movies page** to browse and filter by selected category.
4. Click a movie to view details.
5. Click **Play** to watch the movie.

🖼️ **Screenshot idea:** Main page showing categories + filtered movies by category.

---

## 🌈 Extra Features for All Users

- **Light/Dark Mode** ☀️🌙 – Toggle at the top of the screen.  
- **Search** 🔍 – Search by name, actors, language, and more.
- **Recommendation System** 🤖 – Shows personalized suggestions based on users with similar tastes.
- **Recently Watched** 🕒 – Displays the last movies the user interacted with for quick access.

🖼️ **Screenshot idea:** Recommendation section and recently watched carousel.

---

# 🔐 Admin Features

## 🔑 Granting Admin Privileges

1. Sign out.  
2. Open **MongoDB Compass**.  
3. Edit the `isAdmin` field of the new user to `true`.  
4. Sign in again – the **Admin** button should now appear.

🖼️ **Screenshot idea:** User document in MongoDB with `isAdmin: true`.

---

## 🗂 Managing Categories

1. Click **Admin**.  
2. Choose **Add New Category**.  
3. Enter a name and description.  
4. Edit or delete categories if needed.

🖼️ **Screenshot idea:** Category management screen with Edit/Delete buttons.

---

## 🎬 Adding Movies

1. Click **Edit** on a category.  
2. Click **Add Movie**.  
3. Fill in movie details.  
4. Upload poster, trailer, and movie file.  
5. Click **Add Movie**.

🖼️ **Screenshot idea:** Add movie form + new movie listed in the category.

---

## ✏️ Editing & Managing Movies

1. Click a movie to view details.  
2. Admins can click the ✏️ icon to edit.  
3. You can also delete the movie.

🖼️ **Screenshot idea:** Movie page with edit and delete buttons.
