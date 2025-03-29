package com.example.androidapp;

import android.util.Log;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class UserApi {

    Retrofit retrofit;
    ApiService apiService;

    public UserApi() {
        retrofit = new Retrofit.Builder()
                .baseUrl(MyApplication.getAppContext().getString(R.string.BaseUrl))
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        apiService = retrofit.create(ApiService.class);
    }

    MyApplication myApplication = MyApplication.getInstance();
    String userId = myApplication.getGlobalUserId();

    public void login(User user) {
        Call<LoginResponse> call = apiService.login(user);
        call.enqueue(new Callback<LoginResponse>() {
            @Override
            public void onResponse(Call<LoginResponse> call, Response<LoginResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    String token = response.body().getToken();
                    Log.d("UserApi","connection successful");

                } else {
                    Log.d("UserApi","Error: connection failed");
                }
            }

            @Override
            public void onFailure(Call<LoginResponse> call, Throwable t) {
                Log.e("UserApi","Error: connection failed");
                t.printStackTrace();

            }
        });
    }
}
