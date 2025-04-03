package com.example.androidapp.api;

import com.example.androidapp.LoginResponse;
import com.example.androidapp.entities.Movie;
import com.example.androidapp.entities.User;

import java.util.List;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;
import retrofit2.http.Path;

public interface ApiService {
    @Multipart
    //req
    @POST("users")
    Call<User> post(
            @Part("mail") RequestBody mail,
            @Part("user_name") RequestBody username,
            @Part("password") RequestBody password,
            @Part("nickName") RequestBody nickname,
            @Part("phone") RequestBody phone,
            @Part MultipartBody.Part profilePicture
    );
    @POST("tokens")
    Call<LoginResponse> login(@Body User user);

    @POST("movies/{id}/recommend")
    Call<User> addToWatchList(@Header("Authorization") String authHeader,@Header("userId") String userId, @Path("id") String movieId);

    @GET("movies/{id}/recommend/")
    Call<List<Movie>> getRecommendation (@Header("Authorization") String authHeader,
                                         @Header("userId") String userId, @Path("id") String movieId);
}
