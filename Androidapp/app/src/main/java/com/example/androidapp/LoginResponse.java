package com.example.androidapp;

import com.example.androidapp.entities.User;

public class LoginResponse {
    private User user;
    private String token;

    public User getUser() {
        return user;
    }

    public String getToken() {
        return token;
    }
}
