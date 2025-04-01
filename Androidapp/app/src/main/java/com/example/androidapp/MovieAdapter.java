package com.example.androidapp;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.List;

public class MovieAdapter extends RecyclerView.Adapter<MovieAdapter.MovieViewHolder> {

    private final Context context;
    private final List<Movie> movies;
    private final OnMovieClickListener listener;

    public interface OnMovieClickListener {
        void onMovieClick(Movie movie);
    }

    public MovieAdapter(Context context, List<Movie> movies, OnMovieClickListener listener) {
        this.context = context;
        this.movies = movies;
        this.listener = listener;
    }

    public static class MovieViewHolder extends RecyclerView.ViewHolder {
        ImageView movieImage;

        public MovieViewHolder(View itemView) {
            super(itemView);
            movieImage = itemView.findViewById(R.id.movieImage);
        }
    }

    @NonNull
    @Override
    public MovieViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_movie, parent, false);
        return new MovieViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MovieViewHolder holder, int position) {
        Movie movie = movies.get(position);
        String image = movie.getMovieImage();

        holder.movieImage.setOnClickListener(v -> {
            if (listener != null) {
                listener.onMovieClick(movie);
            }
        });
        if (image != null && !image.isEmpty()) {
            if (image.startsWith("http")) {
                // 🔁 Load image from URL using Glide
                Glide.with(context).load(image).into(holder.movieImage);
            } else {
                String imageUrl = "http://10.0.2.2:3000/" + image;
                Glide.with(context).load(imageUrl).into(holder.movieImage);
            }
        }
    }

    @Override
    public int getItemCount() {
        return movies.size();
    }
}
