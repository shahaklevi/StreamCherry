package com.example.androidapp;

import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.provider.OpenableColumns;
import android.util.Log;
import android.widget.Toast;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.RequestBody;
import okhttp3.logging.HttpLoggingInterceptor;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import android.net.Uri;

import okhttp3.OkHttpClient;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class UserApi {

    Retrofit retrofit;
    ApiService apiService;

    public UserApi() {
        OkHttpClient client = new OkHttpClient.Builder()
                .addInterceptor(new HttpLoggingInterceptor().setLevel(HttpLoggingInterceptor.Level.BODY))
                .build();
        retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:3000/api/")
//                .baseUrl(MyApplication.getAppContext().getString(R.string.BaseUrl))
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

//    public void add(User user, File imagefile) {
//        RequestBody username = RequestBody.create(user.getUser_name(), MediaType.parse("text/plain"));
//        RequestBody password = RequestBody.create(user.getPassword(), MediaType.parse("text/plain"));
//        RequestBody nickname = RequestBody.create(user.getNickName(), MediaType.parse("text/plain"));
//        RequestBody mail = RequestBody.create(user.getMail(), MediaType.parse("text/plain"));
//
//        RequestBody requestFile = RequestBody.create(imagefile,MediaType.parse("image/*"));
//        MultipartBody.Part imagePart = MultipartBody.Part.createFormData("profilePicture", imagefile.getName(), requestFile);
//
//        Call<User> call = apiService.post(mail,username, password, nickname, imagePart);
//        call.enqueue(new Callback<User>() {
//
//            @Override
//            public void onResponse(Call<User> call, Response<User> response) {
//
//                if (response.isSuccessful()) {
//                    if (response.code() == 201) {
//                        Intent i = new Intent(MyApplication.getAppContext(), LoginActivity.class);
//                        i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//                        MyApplication.getAppContext().startActivity(i);
//                    } else {
//                        if (response.body() != null) {
//                            Toast.makeText(MyApplication.getAppContext(), response.body().getUser_name(), Toast.LENGTH_LONG).show();
//                        }
//                    }
//                } else {
//
//                    try {
//                        if (response.errorBody() != null) {
//                            String errorMessage = response.errorBody().string();  // לקרוא את הגוף של השגיאה
//                            Log.e("UserApi", "Error: " + errorMessage);
//                        }
//                    } catch (IOException e) {
//                        e.printStackTrace();
//                        Log.e("UserApi", "An error occurred");
//                    }
//                }
//            }
//            @Override
//            public void onFailure(Call<User> call, Throwable t) {
//                Log.e("UserApi", "Registration failed with error: " + t.getMessage());
//                // Logging the error
//                t.printStackTrace();
//            }
//        });
//    }
public void add(User user, Uri imageUri) {
    ContentResolver contentResolver = MyApplication.getAppContext().getContentResolver();

    RequestBody username = RequestBody.create(user.getUser_name(), MediaType.parse("text/plain"));
    RequestBody password = RequestBody.create(user.getPassword(), MediaType.parse("text/plain"));
    RequestBody nickname = RequestBody.create(user.getNickName(), MediaType.parse("text/plain"));
    RequestBody mail = RequestBody.create(user.getMail(), MediaType.parse("text/plain"));
    RequestBody phone = RequestBody.create(user.getPhone(), MediaType.parse("text/plain"));

    MultipartBody.Part imagePart = null;

    if (imageUri != null) {
        try {
            // קבלת סוג הקובץ (image/jpeg למשל)
            String mimeType = contentResolver.getType(imageUri);
            if (mimeType == null || !mimeType.startsWith("image/")) {
                Toast.makeText(MyApplication.getAppContext(), "Invalid image type", Toast.LENGTH_SHORT).show();
                return;
            }

            InputStream inputStream = contentResolver.openInputStream(imageUri);
            String fileName = getFileName(MyApplication.getAppContext(), imageUri);

            RequestBody requestFile = new InputStreamRequestBody(MediaType.parse(mimeType), inputStream);
            imagePart = MultipartBody.Part.createFormData("profilePicture", fileName, requestFile);

        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(MyApplication.getAppContext(), "Failed to read image", Toast.LENGTH_SHORT).show();
            return;
        }
    }

    Call<User> call = apiService.post(mail, username, password, nickname,phone, imagePart);
    call.enqueue(new Callback<User>() {
        @Override
        public void onResponse(Call<User> call, Response<User> response) {
            if (response.isSuccessful() && response.code() == 201) {
                Intent i = new Intent(MyApplication.getAppContext(), LoginActivity.class);
                i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                MyApplication.getAppContext().startActivity(i);
            } else {
                try {
                    if (response.errorBody() != null) {
                        String errorMessage = response.errorBody().string();
                        Log.e("UserApi", "Error: " + errorMessage);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        @Override
        public void onFailure(Call<User> call, Throwable t) {
            Log.e("UserApi", "Registration failed with error: " + t.getMessage());
        }
    });


}

    private byte[] getBytesFromInputStream(InputStream inputStream) throws IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        int nRead;
        byte[] data = new byte[16384];
        while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
            buffer.write(data, 0, nRead);
        }
        return buffer.toByteArray();
    }

    private String getFileName(Context context, Uri uri) {
        String result = null;
        if (uri.getScheme().equals("content")) {
            try (Cursor cursor = context.getContentResolver().query(uri, null, null, null, null)) {
                if (cursor != null && cursor.moveToFirst()) {
                    int nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                    if (nameIndex != -1) {
                        result = cursor.getString(nameIndex);
                    }
                }
            }
        }
        if (result == null) {
            result = uri.getLastPathSegment();
        }
        return result != null ? result : "image.jpg";
    }

}
