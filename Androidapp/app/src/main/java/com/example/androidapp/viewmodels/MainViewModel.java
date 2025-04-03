package com.example.androidapp.viewmodels;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.androidapp.MyApplication;
import com.example.androidapp.entities.Category;
import com.example.androidapp.MovieCategoryResponse;
import com.example.androidapp.entities.Movie;
import com.example.androidapp.repositories.MovieRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainViewModel extends AndroidViewModel {

    private final MovieRepository repository;
    private final MutableLiveData<List<Movie>> mockMovies = new MutableLiveData<>();
    private final MutableLiveData<List<Movie>> allMovies = new MutableLiveData<>();
    private final boolean USE_MOCK_DATA = false;
    private final Application application;

    public MainViewModel(@NonNull Application application) {
        super(application);
        this.application = application;
        repository = new MovieRepository(application);

        if (USE_MOCK_DATA) {
            mockMovies.setValue(generateMockMovies());
        } else {
            fetchCategoriesThenMovies();
        }
    }

    public LiveData<List<Movie>> getAllMovies() {
        return USE_MOCK_DATA ? mockMovies : allMovies;
    }

    private void fetchCategoriesThenMovies() {
        repository.fetchAllCategories(new Callback<List<Category>>() {
            @Override
            public void onResponse(Call<List<Category>> call, Response<List<Category>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Map<String, String> categoryIdNameMap = new HashMap<>();
                    for (Category cat : response.body()) {
                        categoryIdNameMap.put(cat.getServerId(), cat.getName());
                    }
                    fetchAndMapMovies(categoryIdNameMap);
                }
            }

            @Override
            public void onFailure(Call<List<Category>> call, Throwable t) {
                t.printStackTrace();
            }
        });
    }

    private void fetchAndMapMovies(Map<String, String> categoryMap) {
        SharedPreferences prefs = application.getSharedPreferences("auth", Context.MODE_PRIVATE);
        String userId = prefs.getString("user_id", MyApplication.getInstance().getGlobalUserId());

        repository.getApiService().getAllMovies(userId).enqueue(new Callback<>() {
            @Override
            public void onResponse(Call<MovieCategoryResponse> call, Response<MovieCategoryResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Map<String, List<Movie>> categorized = response.body().getMovies();

                    List<Movie> flatMovies = new ArrayList<>();
                    for (List<Movie> group : categorized.values()) {
                        flatMovies.addAll(group);
                    }

                    // Replace category IDs with names
                    for (Movie movie : flatMovies) {
                        List<String> readableCategories = new ArrayList<>();
                        if (movie.getCategories() != null) {
                            for (String catId : movie.getCategories()) {
                                readableCategories.add(categoryMap.getOrDefault(catId, catId));
                            }
                            movie.setCategories(readableCategories);
                        }
                    }

                    allMovies.postValue(flatMovies);
                }
            }

            @Override
            public void onFailure(Call<MovieCategoryResponse> call, Throwable t) {
                t.printStackTrace();
            }
        });

    }

    private List<Movie> generateMockMovies() {
        List<Movie> movies = new ArrayList<>();

        movies.add(createMockMovie("Mock Movie 1", "https://picsum.photos/300/200?random=1", Arrays.asList("Action", "Drama")));
        movies.add(createMockMovie("Mock Movie 2", "https://picsum.photos/300/200?random=2", Arrays.asList("Comedy")));
        movies.add(createMockMovie("Mock Movie 3", "https://picsum.photos/300/200?random=3", Arrays.asList("Drama")));
        movies.add(createMockMovie("Mock Movie 4", "https://picsum.photos/300/200?random=4", Arrays.asList("Sci-Fi", "Thriller")));

        return movies;
    }

    private Movie createMockMovie(String title, String imageUrl, List<String> categories) {
        Movie movie = new Movie();
        movie.set_id(UUID.randomUUID().toString());
        movie.setTitle(title);
        movie.setDescription("This is a mock description for " + title);
        movie.setReleaseYear(2024);
        movie.setDuration(90);
        movie.setRating(8.5);
        movie.setCast(Arrays.asList("Test Actor", "Mock Star"));
        movie.setMovieFile("https://example.com/mockvideo.mp4");
        movie.setMovieImage(imageUrl);
        movie.setCategories(categories);
        return movie;
    }
}