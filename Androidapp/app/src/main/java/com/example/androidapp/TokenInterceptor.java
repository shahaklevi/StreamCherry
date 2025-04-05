package com.example.androidapp;

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

        Request.Builder builder = original.newBuilder()
                .header("Authorization", token);
        Request request = builder.build();
        return chain.proceed(request);
    }
}