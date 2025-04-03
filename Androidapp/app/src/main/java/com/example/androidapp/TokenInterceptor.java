package com.example.androidapp;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

public class TokenInterceptor implements Interceptor {

    private final String token;

    public TokenInterceptor(String token) {
        if (token.startsWith("Bearer")) {
            this.token = token;
        } else this.token = "Bearer" + token;
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
