package com.example.androidapp.adapters;

import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import com.example.androidapp.activities.MovieActivity;
import com.example.androidapp.entities.Movie;
import com.example.androidapp.R;
import java.util.ArrayList;
import java.util.List;

public class MovieAdapter extends RecyclerView.Adapter<MovieAdapter.MovieViewHolder> {

    private final Context context;
    private List<Movie> movies;
    private final List<String> selectedMovieIds = new ArrayList<>();

    private  Movie choiceMovie;

    // Constructor to initialize the adapter with context and a list of movies
    public MovieAdapter(Context context, List<Movie> movies) {
        this.movies = movies;
        this.context = context;
    }

    /**
     * Create a new ViewHolder for the RecyclerView item (called when a new item view is needed)
     * @param parent   The ViewGroup into which the new View will be added after it is bound to
     *                 an adapter position.
     * @param viewType The view type of the new View.
     */
    @NonNull
    @Override
    public MovieViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(this.context)
                .inflate(R.layout.movie_layout, parent, false);
        return new MovieViewHolder(itemView);
    }

    // Bind the data (movie) to the corresponding ViewHolder
    @Override
    public void onBindViewHolder(MovieViewHolder holder, int position) {
        Movie movie = movies.get(position);
        if (!movies.isEmpty()) {
            Glide.with(holder.itemView.getContext())
                    .load("http://10.0.2.2:3000/" + movie.getMovieImage())
                    .centerCrop()
                    .into(holder.moviePoster);
        } else {
            Toast.makeText(context, "No movies available or response is null", Toast.LENGTH_SHORT).show();
        }

        holder.moviePoster.setOnClickListener(v -> {
            String movieId = movie.get_id();
            if (selectedMovieIds.contains(movieId)) {
                selectedMovieIds.remove(movieId);
            } else {
                selectedMovieIds.add(movieId);
            }

            Intent intent = new Intent(context, MovieActivity.class);
            intent.putExtra("name", movie.getTitle());
            intent.putExtra("year", movie.getReleaseYear() + "");
            intent.putExtra("description", movie.getDescription());
            intent.putExtra("id", movie.get_id());
            intent.putExtra("movie_time", movie.getDuration() + "");
            intent.putExtra("video", movie.getMovieFile());

            context.startActivity(intent);
        });
    }

    public int getItemCount() {
        return movies.size();
    }

    public void setMovies(List<Movie> movies) {
        this.movies = movies;
        notifyDataSetChanged();
    }


    static class MovieViewHolder extends RecyclerView.ViewHolder {
        TextView tvName, tvYear,tvTime, tvDescription;
        ImageButton moviePoster;

        public MovieViewHolder(View itemView) {
            super(itemView);
            tvName = itemView.findViewById(R.id.movieTitle);
            tvYear = itemView.findViewById(R.id.year);
            tvDescription = itemView.findViewById(R.id.movieDescription);
            tvTime = itemView.findViewById(R.id.movieTime);
            moviePoster = itemView.findViewById(R.id.imageBtnMovie);
        }
    }

}

