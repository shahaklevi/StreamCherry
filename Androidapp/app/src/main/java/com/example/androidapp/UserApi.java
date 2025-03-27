//package com.example.androidapp;
//
//import retrofit2.Retrofit;
//import retrofit2.converter.gson.GsonConverterFactory;
//
//public class UserApi {
//
//    Retrofit retrofit;
//    ApiService apiService;
//
//    public UserApi() {
//        retrofit = new Retrofit.Builder()
//                .baseUrl(MyApplication.getAppContext().getString(R.string.BaseUrl))
//                .addConverterFactory(GsonConverterFactory.create())
//                .build();
//
//        apiService = retrofit.create(ApiService.class);
//    }
//
//    MyApplication myApplication = MyApplication.getInstance();
//    String userId = myApplication.getGlobalUserId();
//}
