package com.example.androidapp;

import android.util.Log;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

public class TokenInterceptor implements Interceptor {

    private final String token;
    private MyApplication myApplication;

    public TokenInterceptor(String token) {
        myApplication = MyApplication.getInstance();
        if (token == null || token.trim().isEmpty()) {
            this.token = myApplication.getToken(); // or set a default token if applicable
        } else {
            this.token = token.startsWith("Bearer ") ? token : "Bearer " + token;
        }
    }

    @Override
    public Response intercept(Chain chain) throws IOException {
        Request original = chain.request();
        Request.Builder builder = original.newBuilder();

        if (token != null && !token.trim().isEmpty()) {
            builder.header("Authorization", token);
        } else {
            // If token is not provided, use the default token from MyApplication
            Log.d("TokenInterceptor", "Using default token"+ myApplication.getToken());
            builder.header("Authorization", myApplication.getToken());
        }

        Request request = builder.build();
        return chain.proceed(request);
    }

}