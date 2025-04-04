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
- [🗂 Categories Manage](#-categories-manage)
- [🎬 Movies Manage](#-movies-manage)

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

1. Click **Get Started** . 

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

1. **Home page** displays movies sorted by promoted categories.
  ![image](https://github.com/user-attachments/assets/b353ec8c-bc48-4ac6-a513-0a8f0862da92)

2. Move to **Movies page** to browse and filter by category.
![image](https://github.com/user-attachments/assets/18383e34-ff36-4f71-b5f4-9d4bd6348dca)


3. Click a movie to view details.
![image](https://github.com/user-attachments/assets/57192e8f-e29c-469e-a237-e9710cef6aa1)


4. Click **Play** to watch the movie.
![image](https://github.com/user-attachments/assets/07834871-4985-48db-a5ad-e0b5ab976dc7)


---

## 🌈 Extra Features for All Users

- **Light/Dark Mode** ☀️🌙 – Toggle at the top of the screen.
![image](https://github.com/user-attachments/assets/d8980499-ef8f-46e4-83a2-5ace20bd5df3)


- **Search** 🔍 – Search by name, actors, language, and more.
![image](https://github.com/user-attachments/assets/812d93f4-22ad-4fb4-a8d0-90b992a43bf6)


- **Recommendation System** 🤖 – Shows personalized suggestions based on users with similar tastes.
![image](https://github.com/user-attachments/assets/040060cc-aae2-4636-b01f-e68b6a273466)

- **Recently Watched** 🕒 – Displays the last movies the user interacted with for quick access.
![image](https://github.com/user-attachments/assets/f309501e-3231-41cf-b12c-2b801d25ada4)

---

# 🔐 Admin Zone

## 🔑 Granting Admin Privileges

1. Sign out.  

![image](https://github.com/user-attachments/assets/bdf0a44d-c83a-42cd-9c16-143e28aaaf2e)

2. Open **MongoDB Compass**.  
3. Edit the `manager` field of the new user to `true`.  


![image](https://github.com/user-attachments/assets/967d9a18-8af8-413a-bffb-68adf1d6c676)

4. Sign in again – the **Admin** button should now appear.


<img width="695" alt="image" src="https://github.com/user-attachments/assets/2d18675f-d911-4c93-a5cc-67fdd8270ddd" />

5. Click `Admin` to open the admin dashboard where you can manage categories and movies.

---

## 🗂 Categories Manage

<img width="1220" alt="image" src="https://github.com/user-attachments/assets/a71d98ec-8abb-4f94-9a0b-b3aa0d378346" />

1. In **Admin-Zone**  
2. Choose **Add Category**.  
3. Enter a name and description.  
<img width="934" alt="image" src="https://github.com/user-attachments/assets/70806482-e620-4cf1-bc5b-9d6452bd7e0e" />
4. Edit or delete categories if needed.

---

## 🎬 Movies Manage

1. In **Admin-Zone**  
2. Choose **Add Movie**.  
3. Fill in movie details.  
4. Upload poster, trailer, and movie file.  
5. Edit or delete movies if needed.

<img width="823" alt="image" src="https://github.com/user-attachments/assets/7ed27e4a-b63d-482c-b308-d0c2c5eae866" />


