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
docker-compose --env-file ./WebServer/config/.env.local up --build
```

---

## 🌐 Running the Web Client

1. Go to the `Web/my-app` folder.
   
```bash
cd Web/my-app
```
2. Run:

```bash
npm start
```

---

# 👤 User Features

## 🧑‍💻 Registering and Logging In

### 📝 Register


<img width="1502" alt="image" src="https://github.com/user-attachments/assets/23631b37-142f-44bb-8c9a-3cbe4a1fc4b3" />
1. Click **Get Started**. 

<img width="1490" alt="image" src="https://github.com/user-attachments/assets/421c5105-c674-4be0-a083-a9ce27e2bd79" />

3. Fill in the form and choose an avatar.  
4. Click **Sign Up**.



### 🔓 Login & Logout
<img width="1503" alt="image" src="https://github.com/user-attachments/assets/68f812e7-0b8a-4119-961c-8a4ebe547db6" />
1. To log in, use your registered email and password.  


![image](https://github.com/user-attachments/assets/512e4cef-043e-478d-9240-c503c2aab5d3)
2. To log out, click the avatar icon → **LogOut**.  
3. You can then register a new user or sign in again.

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

# 🔐 Admin Zone

## 🔑 Granting Admin Privileges

1. Sign out.  

![image](https://github.com/user-attachments/assets/bdf0a44d-c83a-42cd-9c16-143e28aaaf2e)

2. Open **MongoDB Compass**.  
3. Edit the `manager` field of the new user to `true`.  


![image](https://github.com/user-attachments/assets/967d9a18-8af8-413a-bffb-68adf1d6c676)

4. Sign in again – the **Admin** button should now appear.

<img width="414" alt="image" src="https://github.com/user-attachments/assets/6ed8f584-557d-4374-80f7-d91772522903" />
5. Click `Admin` to open the admin dashboard where you can manage categories and movies.

---

## 🗂 Managing Categories

<img width="1220" alt="image" src="https://github.com/user-attachments/assets/a71d98ec-8abb-4f94-9a0b-b3aa0d378346" />

1. In **Admin-Zone**  
2. Choose **Add Category**.  
3. Enter a name and description.  


<img width="934" alt="image" src="https://github.com/user-attachments/assets/70806482-e620-4cf1-bc5b-9d6452bd7e0e" />

4. Edit or delete categories if needed.

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
