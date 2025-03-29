package com.example.androidapp;

public class UserRepository {
    private UserApi api;

    // Constructor that initializes the repository with DAO, API, and LiveData
    public UserRepository() {
        api = new UserApi();
    }

    public void add(User user) {

    }

    public void login(User user) {
        api.login(user);
    }
}
