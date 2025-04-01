package com.example.androidapp;

import java.util.List;

public class Category {
    private String _id;
    private String name;
    private List<String> movies;
    private boolean promoted;

    public String get_id() {
        return _id;
    }

    public String getName() {
        return name;
    }

    public List<String> getMovies() {
        return movies;
    }

    public boolean isPromoted() {
        return promoted;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setMovies(List<String> movies) {
        this.movies = movies;
    }

    public void setPromoted(boolean promoted) {
        this.promoted = promoted;
    }
}
