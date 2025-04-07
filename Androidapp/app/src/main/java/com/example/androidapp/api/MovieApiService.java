package com.example.androidapp.api;

import com.example.androidapp.MovieResponse;
import com.example.androidapp.entities.Category;
import com.example.androidapp.MovieCategoryResponse;
import com.example.androidapp.entities.Movie;

import java.util.List;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Part;
import retrofit2.http.Path;

public interface MovieApiService {
    @GET("api/movies")
    Call<MovieCategoryResponse> getAllMovies(@Header("userid") String userId);

    @GET("api/categories")
    Call<List<Category>> getAllCategories();

    @Multipart
    @POST("api/movies")
    Call<MovieResponse> addMovie(
            @Part("title") RequestBody title,
            @Part("description") RequestBody description,
            @Part("releaseYear") RequestBody releaseYear,
            @Part("duration") RequestBody duration,
            @Part("cast") RequestBody cast,
            @Part List<MultipartBody.Part> categories,
            @Part MultipartBody.Part movieFile,
            @Part MultipartBody.Part movieImage
    );

    @DELETE("api/movies/{movieId}")
    Call<ResponseBody> deleteMovie(
            @Path("movieId") String movieId
    );

    @PUT("api/movies/{id}")
    Call<ResponseBody> updateMovie(
            @Path("id") String movieId,
            @Body Movie movie
    );

}
