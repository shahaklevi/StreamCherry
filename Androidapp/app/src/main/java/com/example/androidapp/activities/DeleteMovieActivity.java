package com.example.androidapp.activities;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.ListView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.androidapp.R;
import com.example.androidapp.adapters.MovieListAdapter;
import com.example.androidapp.entities.Movie;
import com.example.androidapp.viewmodels.MainViewModel;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class DeleteMovieActivity extends AppCompatActivity {
    private static final String TAG = "DeleteMovieActivity";
    private ListView listViewDeleteMovies;
    private MovieListAdapter adapter;
    private MainViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_delete_movie);

        listViewDeleteMovies = findViewById(R.id.listViewDeleteMovies);
        viewModel = new ViewModelProvider(this).get(MainViewModel.class);

        // Initialize adapter with both delete and edit listeners
        adapter = new MovieListAdapter(this, new MovieListAdapter.OnMovieActionListener() {
            @Override
            public void onEditClicked(Movie movie) {
                // Launch EditMovieActivity with the selected movie
                Intent intent = new Intent(DeleteMovieActivity.this, EditMovieActivity.class);
                intent.putExtra("movie", movie);
                startActivity(intent);
            }

            @Override
            public void onDeleteClicked(Movie movie) {
                showDeleteConfirmationDialog(movie);
            }
        }, true); // true shows edit buttons

        listViewDeleteMovies.setAdapter(adapter);

        // Observe movie data
        viewModel.getAllMovies().observe(this, movies -> {
            Log.d(TAG, "Received movies. Count: " + movies.size());
            adapter.updateMovies(movies);
        });
    }

    private void showDeleteConfirmationDialog(Movie movie) {
        new AlertDialog.Builder(this)
                .setTitle("Delete Movie")
                .setMessage("Are you sure you want to delete " + movie.getTitle() + "?")
                .setPositiveButton("Delete", (dialog, which) -> deleteMovie(movie))
                .setNegativeButton("Cancel", null)
                .show();
    }

    private void deleteMovie(Movie movie) {
        viewModel.deleteMovie(movie, new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    runOnUiThread(() -> {
                        Toast.makeText(DeleteMovieActivity.this,
                                "Movie deleted successfully",
                                Toast.LENGTH_SHORT).show();
                    });
                } else {
                    try {
                        String errorBody = response.errorBody() != null ?
                                response.errorBody().string() : "null";
                        Log.e(TAG, "Delete Error: " + response.code() + " - " + errorBody);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    runOnUiThread(() -> {
                        Toast.makeText(DeleteMovieActivity.this,
                                "Failed to delete movie (Error: " + response.code() + ")",
                                Toast.LENGTH_LONG).show();
                    });
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                runOnUiThread(() -> {
                    Toast.makeText(DeleteMovieActivity.this,
                            "Network error: " + t.getMessage(),
                            Toast.LENGTH_LONG).show();
                });
                Log.e(TAG, "Delete failed", t);
            }
        });
    }
}