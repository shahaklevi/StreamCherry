package com.example.androidapp;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.androidapp.databinding.ActivityLoginBinding;

public class LoginActivity extends AppCompatActivity {
    private ActivityLoginBinding binding;
    private UserViewModel userViewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityLoginBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        userViewModel = new ViewModelProvider(this).get(UserViewModel.class);

        // Set an OnClickListener for the Start button to navigate to LoginActivity
        binding.btnBack.setOnClickListener(v -> {
            Intent i = new Intent(this, MainActivity.class);
            startActivity(i);
        });

        binding.btnSignIn.setOnClickListener(v -> {
            String username = binding.Username.getText().toString();
            String password = binding.editPassword.getText().toString();
            if (!username.isEmpty() && !password.isEmpty()) {
                User user = new User(username, password);
                userViewModel.login(user);
            }
            else {
                Toast.makeText(LoginActivity.this, "Please fill in all fields", Toast.LENGTH_SHORT).show();
            }
        });
        // On SignUp button click, navigate to RegisterActivity
        binding.btnSignUp.setOnClickListener(v -> {
            Intent i = new Intent(this, RegisterActivity.class);
            startActivity(i);
        });
    }
}