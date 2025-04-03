package com.example.androidapp.viewmodels;
import android.net.Uri;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.androidapp.entities.User;
import com.example.androidapp.repositories.UserRepository;

import java.util.List;

public class UserViewModel extends ViewModel {

    private UserRepository repository;
    private LiveData<List<User>> movies;
    public UserViewModel() {
        repository = new UserRepository();
    }
//    public void add(User user,File imagefile) {
//        repository.add(user, imagefile);
//    }
    public void add(User user, Uri imageUri) {
        repository.add(user, imageUri);
    }
    public void login(User user){
        repository.login(user);
    }


    public void addMovieToWatchList(String movieId) {
        repository.addMovieToWatchList(movieId);
    }
}