# 🚀 Running the Application

This guide explains how to run both the **Web** and **Android** clients, start the backend server, and enable admin access using MongoDB.

---

## 🌐 Running the Web Client

To run the web version of the application:

1. Open your terminal.
2. Navigate to the project’s root directory.
3. Run the following command:

```bash
make lunch-app
```

This command starts the backend server and the React web client together.


---

## 📱 Running the Android Client

To run the Android version of the app:

### Step 1: Start the backend server
Just like the web version, open a terminal and run:

```bash
make lunch-app
```

This will start the backend server on `http://localhost:3000`.

> Android emulators access localhost using `http://10.0.2.2` by default.

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

✅ That’s it! You're ready to explore the platform on both web and mobile.
