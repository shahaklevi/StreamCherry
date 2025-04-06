package com.example.androidapp.activities;

import android.content.res.ColorStateList;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.widget.CompoundButtonCompat;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModelProvider;

import com.example.androidapp.R;
import com.example.androidapp.entities.Category;
import com.example.androidapp.entities.Movie;
import com.example.androidapp.viewmodels.CategoryViewModel;
import com.example.androidapp.viewmodels.MainViewModel;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EditMovieActivity extends AppCompatActivity {

    private EditText editTextTitle, editTextDescription, editTextReleaseYear,
            editTextDuration, editTextCast, editTextDirector;
    private Button buttonSelectMovieFile, buttonSelectMovieImage, buttonEditMovie;
    private LinearLayout linearLayoutCategories;

    CategoryViewModel categoryViewModel;
    MainViewModel viewModel;
    private Movie currentMovie;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_movie);


        // Initialize views
        initViews();
        // Initialize ViewModels
        categoryViewModel = new ViewModelProvider(this).get(CategoryViewModel.class);
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

        buttonEditMovie.setOnClickListener(v -> {
            Toast.makeText(this, "Processing...", Toast.LENGTH_SHORT).show();
            saveMovieChanges();
        });
    }

    private void updateMovie() {
        // Get updated values from form
        String title = editTextTitle.getText().toString().trim();
        String description = editTextDescription.getText().toString().trim();
        int releaseYear = Integer.parseInt(editTextReleaseYear.getText().toString().trim());
        int duration = Integer.parseInt(editTextDuration.getText().toString().trim());
        List<String> cast = Collections.singletonList(editTextCast.getText().toString().trim());


        // Update the movie object
        currentMovie.setTitle(title);
        currentMovie.setDescription(description);
        currentMovie.setReleaseYear(releaseYear);
        currentMovie.setDuration(duration);
        currentMovie.setCast(cast);


        // Get selected category IDs from checkboxes (not the displayed names)
        List<String> selectedCategories = new ArrayList<>();
        for (int i = 0; i < linearLayoutCategories.getChildCount(); i++) {
            CheckBox checkBox = (CheckBox) linearLayoutCategories.getChildAt(i);
            if (checkBox.isChecked()) {
                // Use the tag which contains the category ID instead of getText()
                selectedCategories.add((String) checkBox.getTag());
            }
        }
        currentMovie.setCategories(selectedCategories);


        // Call ViewModel to update movie
        viewModel.updateMovie(currentMovie, new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    runOnUiThread(() -> {
                        Toast.makeText(EditMovieActivity.this, "Movie updated successfully", Toast.LENGTH_SHORT).show();
                        finish();
                    });
                } else {
                    try {
                        String errorBody = response.errorBody() != null ? response.errorBody().string() : "null";
                        Log.e("EditMovieActivity", "Error: " + response.code() + " " + errorBody);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    runOnUiThread(() -> {
                        Toast.makeText(EditMovieActivity.this, "Failed to update movie: " + response.code(), Toast.LENGTH_SHORT).show();
                    });
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                runOnUiThread(() -> {
                    Toast.makeText(EditMovieActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                    Log.e("EditMovieActivity", "Update failed", t);
                });
            }
        });
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
        editTextCast.setText(android.text.TextUtils.join(", ", movie.getCast()));
        editTextDirector.setText(movie.getDirector());  // Add this line
        populateCategories(movie.getCategories(), categoryViewModel.getCategories());
    }

    private void saveMovieChanges() {
        Log.d("EditMovieActivity", "Save button clicked");

        // Validate inputs first
        if (editTextTitle.getText().toString().trim().isEmpty() ||
                editTextReleaseYear.getText().toString().trim().isEmpty() ||
                editTextDuration.getText().toString().trim().isEmpty()) {
            Log.d("EditMovieActivity", "Validation failed: empty fields");
            Toast.makeText(this, "Please fill required fields", Toast.LENGTH_SHORT).show();
            return;
        }

        try {
            Log.d("EditMovieActivity", "Starting update process");
            updateMovie();
        } catch (NumberFormatException e) {
            Log.e("EditMovieActivity", "Number format error", e);
            Toast.makeText(this, "Please enter valid numbers for year and duration", Toast.LENGTH_SHORT).show();
        } catch (Exception e) {
            // Catch any other exceptions
            Log.e("EditMovieActivity", "Unexpected error in update", e);
            Toast.makeText(this, "Error: " + e.getMessage(), Toast.LENGTH_SHORT).show();
        }
    }


    private void populateCategories(List<String> selectedCategoryIds, LiveData<List<Category>> allCategoriesLiveData) {
        linearLayoutCategories.removeAllViews();

        allCategoriesLiveData.observe(this, allCategories -> {
            linearLayoutCategories.removeAllViews();

            for (Category category : allCategories) {
                CheckBox checkBox = new CheckBox(this);
                String categoryId = category.getServerId();

                // Apply styling directly to the checkbox
                checkBox.setTextColor(getResources().getColor(R.color.netflix_light_text, getTheme()));

                // Set checkbox tint to Netflix red
                CompoundButtonCompat.setButtonTintList(checkBox,
                        ColorStateList.valueOf(getResources().getColor(R.color.netflix_red, getTheme())));

                // Set other properties
                boolean isSelected = selectedCategoryIds != null && selectedCategoryIds.contains(categoryId);
                checkBox.setChecked(isSelected);
                checkBox.setTag(categoryId);
                linearLayoutCategories.addView(checkBox);

                categoryViewModel.getCategoryNameByServerId(categoryId, new CategoryViewModel.CategoryNameCallback() {
                    @Override
                    public void onCategoryNameFetched(String categoryName) {
                        runOnUiThread(() -> {
                            checkBox.setText(categoryName);
                        });
                    }
                });
            }
        });
    }

}