package com.example.androidapp;

import android.net.Uri;

import com.example.androidapp.api.UserApi;

public class UserRepository {
    private UserApi api;

    // Constructor that initializes the repository with DAO, API, and LiveData
    public UserRepository() {
        api = new UserApi();
    }

//    public void add(User user, File imagefile) {
//
//        api.add(user,imagefile);
//
//    }
    public void add(User user, Uri imageUri) {
        api.add(user, imageUri);
    }
    public void login(User user) {
        api.login(user);
    }

    public void addMovieToWatchList(String movieId) {
        api.addMovieToWatchList(movieId);
    }
}
