package com.example.androidapp;

import java.util.List;


public class Section {
    private String title;
    private List<Movie> movies;

    public Section(String title, List<Movie> movies) {
        this.title = title;
        this.movies = movies;
    }

    public String getTitle() { return title; }

    public List<Movie> getMovies() { return movies; }
}
