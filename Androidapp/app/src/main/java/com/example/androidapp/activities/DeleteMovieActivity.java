package com.example.androidapp.activities;

import android.os.Bundle;
import android.widget.ListView;

import androidx.appcompat.app.AppCompatActivity;

import com.example.androidapp.R;
import com.example.androidapp.adapters.MovieListAdapter;
import com.example.androidapp.entities.Movie;

import java.util.ArrayList;
import java.util.List;

public class DeleteMovieActivity extends AppCompatActivity {

    private ListView listViewDeleteMovies;
    private MovieListAdapter adapter;
    private List<Movie> movieList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_delete_movie);

        // Initialize the ListView
        listViewDeleteMovies = findViewById(R.id.listViewDeleteMovies);

        // Generate 10 sample movies
        movieList = new ArrayList<>();
        movieList.add(new Movie("Inception"));
        movieList.add(new Movie("Interstellar"));

        // Set up the adapter with the movie list and attach it to the ListView
        adapter = new MovieListAdapter(this, movieList);
        listViewDeleteMovies.setAdapter(adapter);
    }
}
