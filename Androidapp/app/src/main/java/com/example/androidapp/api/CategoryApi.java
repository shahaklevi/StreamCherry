package com.example.androidapp.api;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.annotation.NonNull;

import com.example.androidapp.MyApplication;
import com.example.androidapp.R;
import com.example.androidapp.TokenInterceptor;
import com.example.androidapp.entities.Category;

import java.util.List;

import okhttp3.OkHttpClient;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class CategoryApi {
    private static final String TAG = "CategoryApi";

    ApiService apiService;
    Retrofit retrofit;

    MyApplication application = MyApplication.getInstance();


    public CategoryApi() {
        OkHttpClient client = new OkHttpClient.Builder()
                .addInterceptor(new TokenInterceptor(getAuthToken()))
                .build();
        retrofit = new Retrofit.Builder()
                .baseUrl(MyApplication.getAppContext().getString(R.string.BaseUrl))
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        apiService = retrofit.create(ApiService.class);

    }

    private String getAuthToken() {

        SharedPreferences prefs = application.getSharedPreferences("auth", Context.MODE_PRIVATE);
        String token = prefs.getString("jwt_token", MyApplication.getInstance().getToken());
        return token;
    }


    public void getCategories(Callback<List<Category>> callback) {
        Call<List<Category>> call = apiService.getCategories("67e7c48fa4e2166b64257e8e");
        call.enqueue(new Callback<List<Category>>() {
            @Override
            public void onResponse(@NonNull Call<List<Category>> call, @NonNull Response<List<Category>> response) {
                if (response.isSuccessful()) {
                    List<Category> categories = response.body();
                    if (categories != null) {
                        callback.onResponse(call, response);
                    } else {
                        Log.e(TAG, "Response body is null");
                    }
                } else {
                    Log.e(TAG, "Request failed with code: " + response.code());
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Category>> call, @NonNull Throwable t) {
                Log.e(TAG, "Request failed: " + t.getMessage());
            }
        });
    }

    public void deleteCategory(String serverId, Callback<Void> callback) {
        Call<Void> call = apiService.deleteCategory(serverId);
        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if(response.isSuccessful()){
                    callback.onResponse(call, response);
                } else {
                    Log.e(TAG, "Request failed with code: " + response.code());
                    // ניתן להעביר גם תשובה מוצלחת עם null או לקרוא ל־onFailure בהתאם לצורך
                    callback.onResponse(call, response);
                }
            }
            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                Log.e(TAG, "Request failed: " + t.getMessage());
                callback.onFailure(call, t);
            }
        });
    }

    public void addCategory(Category category, Callback<Category> callback) {
        Call<Category> call = apiService.addCategory(category);
        call.enqueue(new Callback<Category>() {
            @Override
            public void onResponse(@NonNull Call<Category> call, @NonNull Response<Category> response) {
                if (response.isSuccessful()) {
                    Category addedCategory = response.body();
                    if (addedCategory != null) {
                        callback.onResponse(call, response);
                    } else {
                        Log.e(TAG, "Response body is null");
                    }
                } else {
                    Log.e(TAG, "Request failed with code: " + response.code());
                }
            }

            @Override
            public void onFailure(@NonNull Call<Category> call, @NonNull Throwable t) {
                Log.e(TAG, "Request failed: " + t.getMessage());
            }
        });
    }

    public void updateCategory(Category category, Callback<Category> callback) {

        String serverId = category.getServerId();
        if (serverId == null || serverId.isEmpty()) {
            Log.e(TAG, "updateCategory: serverId is null or empty");
            callback.onFailure(null, new IllegalArgumentException("serverId is null or empty"));
            return;
        }


        Call<Category> call = apiService.updateCategory(serverId, category);
        call.enqueue(new Callback<Category>() {
            @Override
            public void onResponse(@NonNull Call<Category> call, @NonNull Response<Category> response) {
                if (response.isSuccessful() && response.body() != null) {
                    callback.onResponse(call, response);
                } else {
                    Log.e(TAG, "Request failed with code: " + response.code());
                    callback.onResponse(call, response);
                }
            }

            @Override
            public void onFailure(@NonNull Call<Category> call, @NonNull Throwable t) {
                Log.e(TAG, "Request failed: " + t.getMessage());
                callback.onFailure(call, t);
            }
        });
    }





}