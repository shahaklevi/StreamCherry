package com.example.androidapp.repositories;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.util.Log;

import androidx.lifecycle.LiveData;

import com.example.androidapp.ApiClient;
import com.example.androidapp.AppDatabase;
import com.example.androidapp.MovieResponse;
import com.example.androidapp.MyApplication;
import com.example.androidapp.api.MovieApi;
import com.example.androidapp.entities.Category;
import com.example.androidapp.MovieCategoryResponse;
import com.example.androidapp.db.MovieDao;
import com.example.androidapp.api.MovieApiService;
import com.example.androidapp.entities.Movie;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MovieRepository {

    static final String TAG = "MovieRepository";
    private final MovieDao movieDao;
    private final MovieApiService apiService;
    private LiveData<List<Movie>> allMovies;
    private final Application application;

    private final MovieApi movieApi;

    public MovieRepository(Application application) {
        this.application = application;
        AppDatabase db = AppDatabase.getInstance(application);
        movieDao = db.movieDao();


        // Get JWT token from SharedPreferences
        SharedPreferences prefs = application.getSharedPreferences("auth", Context.MODE_PRIVATE);
        String token = prefs.getString("jwt_token", MyApplication.getInstance().getToken());
        Log.d("MovieRepository", "Token: " + token);
        //saved token after login , if not valid token then use default token

        movieApi = new MovieApi();
        // Initialize authenticated API service
        apiService = ApiClient.getMovieService(token);
    }

    public LiveData<List<Movie>> getAllMovies() {
        // Get movies from the local DAO immediately.
        LiveData<List<Movie>> localMovies = movieDao.getAllMovies();
        // Trigger a background fetch from the API.
        fetchMoviesFromApi();
        return localMovies;
    }

    public void fetchMoviesFromApi() {
        // Get userId from shared prefs
        SharedPreferences prefs = application.getSharedPreferences("auth", Context.MODE_PRIVATE);
        String userId = prefs.getString("user_id", MyApplication.getInstance().getGlobalUserId());
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
        AsyncTask.execute(() -> {
            movieDao.clearAndInsertMovies(movies);
        });
    }

    // In MovieRepository
    public void addMovie(RequestBody title, RequestBody description, RequestBody releaseYear,
                         RequestBody duration, RequestBody cast,
                         List<MultipartBody.Part> categories, MultipartBody.Part movieFile,
                         MultipartBody.Part movieImage, Callback<MovieResponse> callback) {

        apiService.addMovie(title, description, releaseYear, duration, cast,
                 categories, movieFile, movieImage).enqueue(callback);
    }

    public LiveData<List<Movie>> searchMovies(String query) {
        return movieDao.searchMovies("%" + query + "%");
    }

    public void deleteMovie(Movie movie, Callback<ResponseBody> callback) {

        AsyncTask.execute(() -> {
            movieDao.deleteMovie(movie.get_id());
        });

        // Create the API call
        Call<ResponseBody> call = apiService.deleteMovie(
                movie.get_id() // The movie ID to delete
        );

        // Execute the call asynchronously
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {

                }
                // Forward the response to the original callback
                callback.onResponse(call, response);
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                // Forward the failure to the original callback
                callback.onFailure(call, t);
            }
        });
    }

    public void updateMovie(Movie movie, Callback<ResponseBody> callback) {
        Log.d(TAG, "Updating movie: " + movie.get_id());
        apiService.updateMovie(movie.get_id(), movie).enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    // Update movie in the local Room database
                    new Thread(() -> {
                        movieDao.updateMovie(movie);
                    }).start();
                    callback.onResponse(call, response);
                } else {
                    callback.onResponse(call, response);
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                // Forward the failure to the original callback
                callback.onFailure(call, t);
            }
        });
    }

}


