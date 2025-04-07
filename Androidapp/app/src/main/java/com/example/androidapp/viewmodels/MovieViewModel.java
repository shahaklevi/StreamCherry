package com.example.androidapp.viewmodels;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.Transformations;
import androidx.lifecycle.ViewModel;

import com.example.androidapp.MovieResponse;
import com.example.androidapp.MyApplication;
import com.example.androidapp.entities.Movie;
import com.example.androidapp.repositories.MovieRepository;

import java.util.List;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Callback;

public class MovieViewModel extends ViewModel {

    private MovieRepository movieRepository;
    private MutableLiveData<List<Movie>> movies;
    private LiveData<List<Movie>> searchResults;
    private MutableLiveData<String> searchQuery = new MutableLiveData<>();
    private MyApplication app = MyApplication.getInstance();

    public MovieViewModel() {
        // Initialize the repository with application context
        movieRepository = new MovieRepository(app);
        movies = new MutableLiveData<>();
        // Set initial value from repository's LiveData
        movies.setValue(movieRepository.getAllMovies().getValue());
        searchResults = Transformations.switchMap(searchQuery, query ->
                movieRepository.searchMovies(query)
        );
    }
    // Expose search results to the UI
    public LiveData<List<Movie>> getSearchResults() {
        return searchResults;
    }

    // Update the search query (call this from your activity)
    public void setSearchQuery(String query) {
        searchQuery.setValue(query);
    }
    // Expose the movies as immutable LiveData
    public LiveData<List<Movie>> getAllMovies() {
        return movieRepository.getAllMovies();
    }

    // Trigger fetching movies from the API and updating the database
    public void fetchMoviesFromApi() {
        movieRepository.fetchMoviesFromApi();
    }

    public void addMovie(Movie movie, Callback <MovieResponse> callback) {
        movieRepository.addMovie(movie, callback);
    }


}