package com.example.androidapp.activities;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.media3.common.MediaItem;
import androidx.media3.exoplayer.ExoPlayer;
import androidx.media3.ui.PlayerView;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.androidapp.entities.Movie;
import com.example.androidapp.adapters.MovieAdapter;
import com.example.androidapp.api.MovieApi;
import com.example.androidapp.viewmodels.UserViewModel;
import com.example.androidapp.databinding.ActivityMovieBinding;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class MovieActivity extends AppCompatActivity {
    private ActivityMovieBinding binding;
    private TextView tvName, tvYear,tvTime, tvDescription;
    private PlayerView moviePlayer;
    private ExoPlayer exoPlayer;
    private Button btnPlay;
    private List<Movie> recommendedMoviesList = new ArrayList<>();
    private RecyclerView recyclerView;
    private MovieAdapter movieAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMovieBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        tvName = binding.movieTitle;
        tvYear = binding.year;
        tvTime = binding.movieTime;
        tvDescription = binding.movieDescription;
        moviePlayer = binding.moviePlayer;
        btnPlay = binding.btnPlay;
        recyclerView = binding.recyclerViewRecommended;


        Intent intent = getIntent();
        tvName.setText(intent.getStringExtra("name"));
        tvYear.setText(intent.getStringExtra("year"));
        tvDescription.setText(intent.getStringExtra("description"));
        String movieId = intent.getStringExtra("id");
        String movieTime = intent.getStringExtra("movie_time");

        int totalMinutes = 0;
        try {
            totalMinutes = Integer.parseInt(movieTime);
        } catch (NumberFormatException e) {
            e.printStackTrace();
        }

        int hours = totalMinutes / 60;
        int minutes = totalMinutes % 60;

        String formattedTime = hours + "h " + minutes + "m";
        tvTime.setText(formattedTime);

        exoPlayer = new ExoPlayer.Builder(this).build();
        moviePlayer.setPlayer(exoPlayer);
        String videoUrl = "http://10.0.2.2:3000/" + intent.getStringExtra("video");
        if (videoUrl != null) {
            MediaItem mediaItem = MediaItem.fromUri(videoUrl);

            exoPlayer.setMediaItem(mediaItem);
            exoPlayer.prepare();
            exoPlayer.play();
        } else {
            Log.e("MovieActivity", "Video URL is null or empty");
        }
        btnPlay.setOnClickListener(v -> {
            UserViewModel userViewModel=new UserViewModel();
            userViewModel.addMovieToWatchList(movieId);
            Intent i = new Intent(this, VideoActivity.class);
            i.putExtra("videoUrl", videoUrl);
            startActivity(i);

        });

        recyclerView.setLayoutManager(new GridLayoutManager(this, 3));
        movieAdapter = new MovieAdapter(this, new ArrayList<>());
        recyclerView.setAdapter(movieAdapter);

        MovieApi movieApi = new MovieApi();
        movieApi.recommend(movieId , new Callback<List<Movie>>() {

            @Override
            public void onResponse(Call<List<Movie>> call, Response<List<Movie>> response) {
                Log.d("API Response", "recommend " + response.message());

                if (response.isSuccessful() && response.body() != null) {
                    movieAdapter.setMovies(response.body());
                    Log.d("API Response", "suucses " + response.body().toString());
                }
                else {
                    Log.e("API Response", "Response error: " + response.message());
                }
            }
            @Override
            public void onFailure(Call<List<Movie>> call, Throwable t){
                Log.e("API Failure", "Failed to load searched movies: " + t.getMessage());
            }
        });


    }

}