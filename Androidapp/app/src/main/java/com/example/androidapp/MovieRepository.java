//package com.example.androidapp;
//
//
//import android.app.Application;
//import android.content.Context;
//import android.content.SharedPreferences;
//import android.os.AsyncTask;
//
//import androidx.lifecycle.LiveData;
//
//import java.util.List;
//
//import retrofit2.Call;
//import retrofit2.Callback;
//import retrofit2.Response;
//
//public class MovieRepository {
//    private final MovieDao movieDao;
//    private final ApiService apiService;
//    private final LiveData<List<Movie>> allMovies;
//
//    public MovieRepository(Application application) {
//        AppDatabase db = AppDatabase.getInstance(application);
//        movieDao = db.movieDao();
//        allMovies = movieDao.getAllMovies();
//
//        // Get JWT token from SharedPreferences
//        SharedPreferences prefs = application.getSharedPreferences("auth", Context.MODE_PRIVATE);
//        String token = prefs.getString("jwt_token", null);
//
//        // Initialize authenticated API service
//        apiService = ApiClient.getMovieService(token);
//    }
//
//    public LiveData<List<Movie>> getAllMovies() {
//        return allMovies;
//    }
//
////    public void fetchMoviesFromApi() {
////        apiService.getAllMovies().enqueue(new Callback<List<Movie>>() {
////            @Override
////            public void onResponse(Call<List<Movie>> call, Response<List<Movie>> response) {
////                if (response.isSuccessful() && response.body() != null) {
////                    insertMovies(response.body());
////                }
////            }
////
////            @Override
////            public void onFailure(Call<List<Movie>> call, Throwable t) {
////                t.printStackTrace();
////            }
////        });
////    }
//
//    private void insertMovies(List<Movie> movies) {
//        AsyncTask.execute(() -> movieDao.insertMovies(movies));
//    }
//}
