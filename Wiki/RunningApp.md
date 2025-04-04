# 🚀 Running the Application

This guide explains how to run the backend server using Docker, start the Web and Android clients, and enable admin access via MongoDB.

---

## 🐳 Starting the Server (Docker)

Before running any client, you need to start the backend server and recommendation system via Docker.

1. Open a terminal in the project’s root directory.
2. Run the following commands:

```bash
docker-compose up
```

These commands will initialize the containers for the web server (`app`) and the movie recommender.

---

## 🌐 Running the Web Client

After starting the backend server:

1. Navigate to the React client folder:

```bash
cd .\Web\my-app
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

This will launch the React app at `http://localhost:3000`.

---

## 📱 Running the Android Client

To run the Android version of the app:

### Step 1: Make sure the server is running
As explained above, the server must be running via Docker.

### Step 2: Open Android Studio
- Open the Android project in Android Studio.
- Allow Gradle to sync if needed.

### Step 3: Launch the emulator
- Start an emulator from the **AVD Manager**, or connect a physical device with debugging enabled.

### Step 4: Run the app
- Click the green **Run** button in Android Studio, or press **Shift + F10**.
- The app should build and launch on your emulator/device.


---

## 🛠 Enabling Admin Access via MongoDB

To promote a regular user to an admin, follow these steps:

1. Open your MongoDB database using a tool like **MongoDB Compass** or the CLI.
2. Navigate to the `users` collection.
3. Find the user document you want to update.
4. Set the `manager` field to `true`.
5. Save the changes.
6. Log in again with that user in either the web or Android app. The user will now have access to admin-only features like managing movies and categories.

---


