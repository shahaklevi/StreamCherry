package com.example.androidapp;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;

public interface ApiService {
    @POST("tokens")
    Call<LoginResponse> login(@Body User user);
}
