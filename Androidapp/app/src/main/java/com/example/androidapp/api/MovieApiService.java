package com.example.androidapp.api;

import com.example.androidapp.entities.Category;
import com.example.androidapp.MovieCategoryResponse;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Header;

public interface MovieApiService {
    @GET("api/movies")
    Call<MovieCategoryResponse> getAllMovies(@Header("userid") String userId);

    @GET("api/categories")
    Call<List<Category>> getAllCategories();

}
