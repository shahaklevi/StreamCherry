package com.example.androidapp;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.VideoView;

import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.ArrayList;
import java.util.List;

public class MovieAdapter extends RecyclerView.Adapter<MovieAdapter.MovieViewHolder> {

    private List<Movie> movies;
    private List<String> selectedMovieIds = new ArrayList<>();

    private  Movie choiceMovie;
    private Context context;
    private boolean isSingleChoice;

    // Constructor to initialize the adapter with context and a list of movies
    public MovieAdapter(Context context,List<Movie> movies, boolean isSingleChoice) {

        this.movies = movies;
        this.context = context;
        this.isSingleChoice = isSingleChoice;
    }

    // Create a new ViewHolder for the RecyclerView item (called when a new item view is needed)
    @Override
    public MovieViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(this.context)
                .inflate(R.layout.movie_layout, parent, false);
        return new MovieViewHolder(itemView);
    }

    // Bind the data (movie) to the corresponding ViewHolder
    @Override
    public void onBindViewHolder(MovieViewHolder holder, int position) {
        Movie movie = movies.get(position);
        if (movies != null && !movies.isEmpty()) {
            Glide.with(holder.itemView.getContext())
                    .load("http://10.0.2.2:3000/" + movie.getMovieImage())
                    .centerCrop()
                    .into(holder.moviePoster);

        } else {
            Toast.makeText(MyApplication.getAppContext(), "No movies available or response is null", Toast.LENGTH_SHORT).show();
        }

        holder.moviePoster.setOnClickListener(v -> {
            String movieId = movie.get_id();
            if (isSingleChoice) {
                selectedMovieIds.clear();
                selectedMovieIds.add(movieId);
            } else {
                if (selectedMovieIds.contains(movieId)) {
                    selectedMovieIds.remove(movieId);
                    choiceMovie = movie;
                } else {
                    selectedMovieIds.add(movieId);
                }
            }
        });
    }

    public int getItemCount() {
        return movies.size();
    }

    public List<String> getSelectedMovieIds() {
        return selectedMovieIds;
    }

    public Movie getChoiceMovie(){
        return choiceMovie;
    }

    public void setMovies(List<Movie> movies) {
        this.movies = movies;
        notifyDataSetChanged();
    }


    static class MovieViewHolder extends RecyclerView.ViewHolder {
        TextView tvName, tvYear,tvTime, tvDescription;
        ImageButton moviePoster;
        VideoView videoView;

        public MovieViewHolder(View itemView) {
            super(itemView);
            tvName = itemView.findViewById(R.id.movieTitle);
            tvYear = itemView.findViewById(R.id.year);
            tvDescription = itemView.findViewById(R.id.movieDescription);
            tvTime = itemView.findViewById(R.id.movieTime);
//            videoView = itemView.findViewById(R.id.vid;
            moviePoster = itemView.findViewById(R.id.imageBtnMovie);
        }
    }
    }
