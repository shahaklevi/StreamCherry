package com.example.androidapp;

import android.net.Uri;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.media3.ui.PlayerView;

import com.example.androidapp.databinding.ActivityVideoBinding;
import androidx.media3.exoplayer.ExoPlayer;
import androidx.media3.common.MediaItem;

public class VideoActivity extends AppCompatActivity {
    private PlayerView videoMovie;
    private ExoPlayer exoPlayer;
    private ActivityVideoBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityVideoBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        videoMovie = binding.videoMovie;

        exoPlayer = new ExoPlayer.Builder(this).build();
        videoMovie.setPlayer(exoPlayer);

        // Get the video URL from the intent's extras
        String videoUrl = getIntent().getStringExtra("videoUrl");
        if (videoUrl != null) {
            Uri videoUri = Uri.parse(videoUrl);

            MediaItem mediaItem = MediaItem.fromUri(videoUri);
            // Set the media item to ExoPlayer, prepare it, and start playback
            exoPlayer.setMediaItem(mediaItem);
            exoPlayer.prepare();
            exoPlayer.play();
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
        // Release the player when the activity is stopped to prevent memory leaks
        if (exoPlayer != null) {
            exoPlayer.release();
        }
    }

}