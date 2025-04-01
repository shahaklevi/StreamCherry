package com.example.androidapp;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MovieApi {
    private MovieDao dao;

    Retrofit retrofit;
    ApiService apiService;

    // Constructor to initialize Retrofit and ApiService
    public MovieApi() {
        retrofit = new Retrofit.Builder()
                .baseUrl(MyApplication.getAppContext().getString(R.string.BaseUrl))
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        apiService = retrofit.create(ApiService.class);
    }
    MyApplication myApplication = MyApplication.getInstance();

    String userId = myApplication.getGlobalUserId();
    String token= "Bearer "+ myApplication.getToken();
    public void recommend(String movieId, final Callback<List<Movie>> callback) {
        Call<List<Movie>> call = apiService.getRecommendation(token,userId, movieId);
        call.enqueue(new Callback<List<Movie>>() {
            @Override
            public void onResponse(Call<List<Movie>> call, Response<List<Movie>> response) {
                if (response.isSuccessful()) {
                    callback.onResponse(call, Response.success(response.body()));
                } else {
                    if (response.code() == 404) {
                        callback.onFailure(call, new Throwable("Failed to get searched movies"));
                    } else {
                        callback.onFailure(call, new Throwable("Failed to get searched movies"));
                    }
                }
            }

            @Override
            public void onFailure(Call<List<Movie>> call, Throwable t) {
                callback.onFailure(call, t);
            }
        });
}
}
