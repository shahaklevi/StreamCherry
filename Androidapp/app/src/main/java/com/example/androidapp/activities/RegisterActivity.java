package com.example.androidapp.activities;

import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.OpenableColumns;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.PickVisualMediaRequest;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.androidapp.entities.User;
import com.example.androidapp.viewmodels.UserViewModel;
import com.example.androidapp.databinding.ActivityRegisterBinding;

public class RegisterActivity extends AppCompatActivity {
    private ActivityRegisterBinding binding;
    private UserViewModel userViewModel;
    private String selectedImageUri;

    private final ActivityResultLauncher<PickVisualMediaRequest> pickImageLauncher =
            registerForActivityResult(new ActivityResultContracts.PickVisualMedia(), uri -> {
                if (uri != null) {
                    selectedImageUri = uri.toString();
                    binding.imageViewProfilePic.setImageURI(uri);
                } else {
                    Toast.makeText(this, "No image selected", Toast.LENGTH_SHORT).show();
                }
            });

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityRegisterBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        userViewModel = new ViewModelProvider(this).get(UserViewModel.class);

        binding.btnBack.setOnClickListener(v -> {
            startActivity(new Intent(RegisterActivity.this, LoginActivity.class));
        });

        binding.btnChooseImage.setOnClickListener(v -> {
            pickImageLauncher.launch(new PickVisualMediaRequest.Builder()
                    .setMediaType(ActivityResultContracts.PickVisualMedia.ImageOnly.INSTANCE)
                    .build());
        });

        binding.btnSignIn.setOnClickListener(v -> {
            String username = binding.UserName.getText().toString();
            String password = binding.Password.getText().toString();
            String verifyPassword = binding.Confirm.getText().toString();
            String nickname = binding.Nickname.getText().toString();
            String email = binding.Email.getText().toString();
            String phone = binding.Phone.getText().toString();

            if (username.isEmpty() || password.isEmpty() || verifyPassword.isEmpty() || nickname.isEmpty()) {
                Toast.makeText(this, "All fields are required", Toast.LENGTH_LONG).show();
            } else if (!password.equals(verifyPassword)) {
                Toast.makeText(this, "Passwords do not match", Toast.LENGTH_LONG).show();
            } else {
//                File imageFile = null;
//                if (selectedImageUri != null && !selectedImageUri.isEmpty()) {
//                    imageFile = new File(Uri.parse(selectedImageUri).getPath()); // אפשרות אחרת: להשאיר null ולשלוח רק את ה-URI
//                }
                Uri imageUri = selectedImageUri != null ? Uri.parse(selectedImageUri) : null;

                User user = new User(email, username, password, nickname, phone);
//                userViewModel.add(user, imageFile);
                userViewModel.add(user, imageUri);

            }
        });
    }

    public String getFileName(Uri uri) {
        String result = null;
        if ("content".equals(uri.getScheme())) {
            try (Cursor cursor = getContentResolver().query(uri, null, null, null, null)) {
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