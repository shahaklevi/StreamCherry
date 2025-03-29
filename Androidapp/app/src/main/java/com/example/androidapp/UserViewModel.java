package com.example.androidapp;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;
import com.example.androidapp.UserRepository;

import java.io.File;
import java.util.List;

public class UserViewModel extends ViewModel {

    private UserRepository repository;
    public UserViewModel() {
        repository = new UserRepository();
    }
    public void add(User user) {
        repository.add(user);
    }
    public void login(User user){
        repository.login(user);
    }
}