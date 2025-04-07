package com.example.androidapp;

import com.example.androidapp.entities.Movie;
import com.google.gson.annotations.SerializedName;

public class MovieResponse {

    @SerializedName("movie")
    private Movie movie;

    // Default constructor
    public MovieResponse() {}

    // Getter for the movie field
    public Movie getMovie() {
        return movie;
    }

    // Setter for the movie field
    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    @Override
    public String toString() {
        return "MovieResponse{" +
                "movie=" + movie +
                '}';
    }
}
