package com.example.androidapp.activities;

import android.app.ProgressDialog;
import android.content.ContentResolver;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.OpenableColumns;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.GridLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.androidapp.MovieResponse;
import com.example.androidapp.R;
import com.example.androidapp.entities.Movie;
import com.example.androidapp.viewmodels.MovieViewModel;
import com.example.androidapp.viewmodels.CategoryViewModel;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AddMovieActivity extends AppCompatActivity {

    // שדות טופס
    private EditText editTextTitle, editTextDescription, editTextReleaseYear,
            editTextDuration, editTextCast;
    private GridLayout gridLayoutCategories;
    private Button btnSaveMovie,btnSelectImage,btnSelectVideoFile;

    // רשימת מזהי הקטגוריות שנבחרו (מעדכנים לפי בחירת המשתמש)
    private List<String> selectedCategoryIds = new ArrayList<>();

    private MovieViewModel movieViewModel;
    private CategoryViewModel categoryViewModel;
    private static final int PICK_IMAGE_REQUEST = 1;
    private static final int PICK_VIDEO_REQUEST = 2;

    // Uri variables to store selected file paths
    private Uri selectedImageUri = null;
    private Uri selectedVideoUri = null;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_movie);

        // Initialize UI components
        editTextTitle = findViewById(R.id.editTextTitle);
        editTextDescription = findViewById(R.id.editTextDescription);
        editTextReleaseYear = findViewById(R.id.editTextReleaseYear);
        editTextDuration = findViewById(R.id.editTextDuration);
        editTextCast = findViewById(R.id.editTextCast);
        gridLayoutCategories = findViewById(R.id.gridLayoutCategories);
        btnSaveMovie = findViewById(R.id.btnSaveMovie);
        // Initialize file selection buttons
        btnSelectImage = findViewById(R.id.btnSelectImage);
        btnSelectVideoFile = findViewById(R.id.btnSelectVideoFile);

        // Add click listeners
        btnSelectImage.setOnClickListener(v -> selectImage());
        btnSelectVideoFile.setOnClickListener(v -> selectVideo());

        // Initialize ViewModel
        movieViewModel = new ViewModelProvider(this).get(MovieViewModel.class);
        categoryViewModel = new ViewModelProvider(this).get(CategoryViewModel.class);


        // Get categories from ViewModel and populate the GridLayout
        categoryViewModel.getCategories().observe(this, categories -> {
            gridLayoutCategories.removeAllViews();
            for (com.example.androidapp.entities.Category category : categories) {
                // Inflate של layout מותאם אישית ל-checkbox
                View checkboxItem = LayoutInflater.from(this)
                        .inflate(R.layout.checkbox_category_item, gridLayoutCategories, false);

                CheckBox checkBox = checkboxItem.findViewById(R.id.checkBoxCategory);
                checkBox.setText(category.getName());

                checkBox.setTag(category.getServerId());


                checkBox.setOnCheckedChangeListener((buttonView, isChecked) -> {
                    String catId = buttonView.getTag().toString();
                    if (isChecked) {
                        if (!selectedCategoryIds.contains(catId)) {
                            selectedCategoryIds.add(catId);
                        }
                    } else {
                        selectedCategoryIds.remove(catId);
                    }
                });

                gridLayoutCategories.addView(checkboxItem);
            }
        });

        // Listener לכפתור שמירה
        btnSaveMovie.setOnClickListener(v -> createAndAddMovie());
    }

    private void createAndAddMovie() {
        // Get data from fields
        String title = editTextTitle.getText().toString().trim();
        String description = editTextDescription.getText().toString().trim();
        String releaseYearStr = editTextReleaseYear.getText().toString().trim();
        String durationStr = editTextDuration.getText().toString().trim();
        String cast = editTextCast.getText().toString().trim();


        // Validation
        if(title.isEmpty() || releaseYearStr.isEmpty() || durationStr.isEmpty()){
            Toast.makeText(this, "Please fill required fields", Toast.LENGTH_SHORT).show();
            return;
        }

        // Show progress dialog
        ProgressDialog progressDialog = new ProgressDialog(this);
        progressDialog.setMessage("Adding movie...");
        progressDialog.setCancelable(false);
        progressDialog.show();

        // Create request parts
        RequestBody titlePart = RequestBody.create(MediaType.parse("text/plain"), title);
        RequestBody descriptionPart = RequestBody.create(MediaType.parse("text/plain"), description);
        RequestBody releaseYearPart = RequestBody.create(MediaType.parse("text/plain"), releaseYearStr);
        RequestBody durationPart = RequestBody.create(MediaType.parse("text/plain"), durationStr);
        RequestBody castPart = RequestBody.create(MediaType.parse("text/plain"), cast);


        // Categories
        List<MultipartBody.Part> categoryParts = new ArrayList<>();
        for (String categoryId : selectedCategoryIds) {
            MultipartBody.Part categoryPart = MultipartBody.Part.createFormData("categories[]", categoryId);
            categoryParts.add(categoryPart);
        }

        // Files
        MultipartBody.Part movieFilePart = null;
        if (selectedVideoUri != null) {
            movieFilePart = prepareFilePart("movieFile", selectedVideoUri);
        }

        MultipartBody.Part movieImagePart = null;
        if (selectedImageUri != null) {
            movieImagePart = prepareFilePart("movieImage", selectedImageUri);
        }

        // Call API
        movieViewModel.addMovie(titlePart, descriptionPart, releaseYearPart, durationPart,
                castPart, categoryParts, movieFilePart, movieImagePart,
                new Callback<MovieResponse>() {
                    @Override
                    public void onResponse(Call<MovieResponse> call, Response<MovieResponse> response) {
                        progressDialog.dismiss();
                        if(response.isSuccessful()){
                            Toast.makeText(AddMovieActivity.this, "Movie added successfully", Toast.LENGTH_SHORT).show();
                            finish();
                        } else {
                            try {
                                String errorBody = response.errorBody() != null ? response.errorBody().string() : "null";
                                Log.e("AddMovieActivity", "Error: " + response.code() + " " + errorBody);
                                Toast.makeText(AddMovieActivity.this, "Failed to add movie: " + response.code(), Toast.LENGTH_SHORT).show();
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }
                    }

                    @Override
                    public void onFailure(Call<MovieResponse> call, Throwable t) {
                        progressDialog.dismiss();
                        Toast.makeText(AddMovieActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                        Log.e("AddMovieActivity", "Error: " + t.getMessage());
                    }
                });
    }

    private MultipartBody.Part prepareFilePart(String partName, Uri fileUri) {
        try {
            ContentResolver resolver = getContentResolver();
            String mimeType = resolver.getType(fileUri);
            String fileName = getFileName(fileUri);

            InputStream inputStream = resolver.openInputStream(fileUri);
            byte[] fileBytes = getBytes(inputStream);

            RequestBody requestFile = RequestBody.create(MediaType.parse(mimeType), fileBytes);
            return MultipartBody.Part.createFormData(partName, fileName, requestFile);
        } catch (Exception e) {
            Log.e("AddMovieActivity", "Error preparing file: " + e.getMessage());
            return null;
        }
    }

    private String getFileName(Uri uri) {
        String result = null;
        if (uri.getScheme().equals("content")) {
            Cursor cursor = getContentResolver().query(uri, null, null, null, null);
            try {
                if (cursor != null && cursor.moveToFirst()) {
                    int nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                    result = cursor.getString(nameIndex);
                }
            } finally {
                if (cursor != null) cursor.close();
            }
        }
        if (result == null) {
            result = uri.getPath();
            int cut = result.lastIndexOf('/');
            if (cut != -1) {
                result = result.substring(cut + 1);
            }
        }
        return result;
    }

    private byte[] getBytes(InputStream inputStream) throws IOException {
        ByteArrayOutputStream byteBuffer = new ByteArrayOutputStream();
        int bufferSize = 1024;
        byte[] buffer = new byte[bufferSize];
        int len;
        while ((len = inputStream.read(buffer)) != -1) {
            byteBuffer.write(buffer, 0, len);
        }
        return byteBuffer.toByteArray();
    }
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (resultCode == RESULT_OK && data != null && data.getData() != null) {
            if (requestCode == PICK_IMAGE_REQUEST) {
                selectedImageUri = data.getData();
                TextView textViewImageStatus = findViewById(R.id.textMovieImageSelected); // Make sure this ID exists
                textViewImageStatus.setText("Image selected: " + getFileName(selectedImageUri));
                textViewImageStatus.setTextColor(getResources().getColor(R.color.green_success));
                btnSelectImage.setText("Image selected ✓");
                Toast.makeText(this, "Image selected", Toast.LENGTH_SHORT).show();
            } else if (requestCode == PICK_VIDEO_REQUEST) {
                selectedVideoUri = data.getData();
                // Update your TextView
                TextView textViewVideoStatus = findViewById(R.id.textMovieFileSelected); // Make sure this ID exists
                textViewVideoStatus.setText("Video selected: " + getFileName(selectedVideoUri));
                textViewVideoStatus.setTextColor(getResources().getColor(R.color.green_success));
                btnSelectVideoFile.setText("Video selected ✓");
                Toast.makeText(this, "Video selected", Toast.LENGTH_SHORT).show();
            }
        }
    }
    private void selectImage() {
        Intent intent = new Intent();
        intent.setType("image/*");
        intent.setAction(Intent.ACTION_GET_CONTENT);
        startActivityForResult(Intent.createChooser(intent, "Select Image"), PICK_IMAGE_REQUEST);
    }

    private void selectVideo() {
        Intent intent = new Intent();
        intent.setType("video/*");
        intent.setAction(Intent.ACTION_GET_CONTENT);
        startActivityForResult(Intent.createChooser(intent, "Select Video"), PICK_VIDEO_REQUEST);
    }
}