package com.example.androidapp;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;

public interface ApiService {
    @Multipart
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
}
