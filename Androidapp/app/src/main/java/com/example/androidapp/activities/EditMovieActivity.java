package com.example.androidapp.activities;

import android.os.Bundle;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.androidapp.R;
import com.example.androidapp.entities.Movie;
import com.example.androidapp.viewmodels.MainViewModel;

import java.util.List;

public class EditMovieActivity extends AppCompatActivity {

    private EditText editTextTitle, editTextDescription, editTextReleaseYear,
            editTextDuration, editTextCast, editTextDirector;
    private Button buttonSelectMovieFile, buttonSelectMovieImage, buttonEditMovie;
    private LinearLayout linearLayoutCategories;

    MainViewModel viewModel;
    private Movie currentMovie;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_movie);

        // Initialize views
        initViews();

        viewModel = new ViewModelProvider(this).get(MainViewModel.class);

        // Get the passed Movie object
        currentMovie = (Movie) getIntent().getSerializableExtra("movie");

        if (currentMovie != null) {
            // Populate form with movie data
            populateForm(currentMovie);
        } else {
            Toast.makeText(this, "No movie data received", Toast.LENGTH_SHORT).show();
            finish();
        }

        // Set up save button click listener
        buttonEditMovie.setOnClickListener(v -> saveMovieChanges());
    }

    private void initViews() {
        editTextTitle = findViewById(R.id.editTextTitle);
        editTextDescription = findViewById(R.id.editTextDescription);
        editTextReleaseYear = findViewById(R.id.editTextReleaseYear);
        editTextDuration = findViewById(R.id.editTextDuration);
        editTextCast = findViewById(R.id.editTextCast);
        editTextDirector = findViewById(R.id.editTextDirector);
        buttonSelectMovieFile = findViewById(R.id.buttonSelectMovieFile);
        buttonSelectMovieImage = findViewById(R.id.buttonSelectMovieImage);
        buttonEditMovie = findViewById(R.id.buttonEditMovie);
        linearLayoutCategories = findViewById(R.id.linearLayoutCategories);
    }

    private void populateForm(Movie movie) {
        editTextTitle.setText(movie.getTitle());
        editTextDescription.setText(movie.getDescription());
        editTextReleaseYear.setText(String.valueOf(movie.getReleaseYear()));
        editTextDuration.setText(String.valueOf(movie.getDuration()));
        populateCategories(movie.getCategories());
    }

    private void saveMovieChanges() {
        // Get updated values from form
        String title = editTextTitle.getText().toString().trim();
        String description = editTextDescription.getText().toString().trim();
        int releaseYear = Integer.parseInt(editTextReleaseYear.getText().toString().trim());
        int duration = Integer.parseInt(editTextDuration.getText().toString().trim());
        String cast = editTextCast.getText().toString().trim();
        String director = editTextDirector.getText().toString().trim();

        // Update the movie object
        currentMovie.setTitle(title);
        currentMovie.setDescription(description);
        currentMovie.setReleaseYear(releaseYear);
        currentMovie.setDuration(duration);
        currentMovie.setCast(cast);
        currentMovie.setDirector(director);



//        viewModel.updateMovie(currentMovie);

        Toast.makeText(this, "Movie updated successfully", Toast.LENGTH_SHORT).show();
        finish();
    }


    private void populateCategories(List<String> categories) {
        linearLayoutCategories.removeAllViews();

        for (String category : categories) {
            CheckBox checkBox = new CheckBox(this);
            checkBox.setText(category);
            checkBox.setChecked(true);
            linearLayoutCategories.addView(checkBox);
        }
    }

}