package com.example.androidapp;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.AsyncTask;

import androidx.lifecycle.LiveData;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MovieRepository {
    private final MovieDao movieDao;
    private final MovieApiService apiService;
    private final LiveData<List<Movie>> allMovies;
    private final Application application;

    public MovieRepository(Application application) {
        this.application = application;
        AppDatabase db = AppDatabase.getInstance(application);
        movieDao = db.movieDao();
        allMovies = movieDao.getAllMovies();

        // Get JWT token from SharedPreferences
        SharedPreferences prefs = application.getSharedPreferences("auth", Context.MODE_PRIVATE);
        String token = prefs.getString("jwt_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2VjNGNjYTUyYjYyZWYxMzMzZWQzZjkiLCJ1c2VyX25hbWUiOiJoaWkiLCJtYWlsIjoiaGlpQGdtYWlsLmNvbSIsInBob25lIjoiMDU4NjU1MjAwNCIsInByb2ZpbGVQaWN0dXJlIjoiL2ltYWdlcy9hdmF0YXJzL2F2YXRhcjEud2VicCIsIm1hbmFnZXIiOmZhbHNlLCJpYXQiOjE3NDM1Mzk0MDUsImV4cCI6MTc0MzYyNTgwNX0.zzc7dFSmPtMlPx3PK0GdUQRV1PEoH0rdqlPm-Nr0JPM");
        //saved token after login , if not valid token then use default token


        // Initialize authenticated API service
        apiService = ApiClient.getMovieService(token);
    }

    public LiveData<List<Movie>> getAllMovies() {
        return allMovies;
    }

    public void fetchMoviesFromApi() {
        // Get userId from shared prefs
        SharedPreferences prefs = application.getSharedPreferences("auth", Context.MODE_PRIVATE);
        String userId = prefs.getString("user_id", "67ec4cca52b62ef1333ed3f9");
        // how to get userId from token

        if (userId == null) {
            System.err.println("❌ Missing user_id in SharedPreferences");
            return;
        }

        apiService.getAllMovies(userId).enqueue(new Callback<MovieCategoryResponse>() {
            @Override
            public void onResponse(Call<MovieCategoryResponse> call, Response<MovieCategoryResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Map<String, List<Movie>> categorized = response.body().getMovies();

                    // Flatten all category movie lists
                    List<Movie> allMovies = new ArrayList<>();
                    for (List<Movie> categoryMovies : categorized.values()) {
                        allMovies.addAll(categoryMovies);
                    }

                    insertMovies(allMovies);
                }
            }

            @Override
            public void onFailure(Call<MovieCategoryResponse> call, Throwable t) {
                t.printStackTrace();
            }
        });
    }

    public void fetchAllCategories(Callback<List<Category>> callback) {
        apiService.getAllCategories().enqueue(callback);
    }

    public MovieApiService getApiService() {
        return apiService;
    }

    private void insertMovies(List<Movie> movies) {
        AsyncTask.execute(() -> movieDao.insertMovies(movies));
    }
}
