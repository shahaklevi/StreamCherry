package com.example.androidapp;

public class User {

    private String username;
    private String password;
    private String confirmPassword;
    private String nickname;
    private String photo;


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public User(String username, String password, String nickname) {
        this.username = username;
        this.password = password;
        this.nickname = nickname;
    }
    public User(String username, String password, String nickname, String photo) {
        this.username = username;
        this.password = password;
        this.nickname = nickname;
        this.photo = photo;
    }
    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }
    public User() {
    }
}
