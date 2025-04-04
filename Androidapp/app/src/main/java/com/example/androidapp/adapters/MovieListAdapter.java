package com.example.androidapp.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.TextView;

import com.example.androidapp.R;
import com.example.androidapp.entities.Movie;

import java.util.List;

public class MovieListAdapter extends BaseAdapter {
    private List<Movie> movies;
    private final LayoutInflater inflater;

    public MovieListAdapter(Context context, List<Movie> movies) {
        this.inflater = LayoutInflater.from(context);
        this.movies = movies;
    }

    public void updateMovies(List<Movie> movies) {
        this.movies = movies;
        notifyDataSetChanged();
    }

    @Override
    public int getCount() {
        return movies.size();
    }

    @Override
    public Movie getItem(int position) {
        return movies.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View view = convertView;
        if (view == null) {
            view = inflater.inflate(R.layout.item_movie_delete, parent, false);
        }

        Movie movie = getItem(position);
        TextView tvTitle = view.findViewById(R.id.tvMovieTitle);
        Button btnDelete = view.findViewById(R.id.btnDelete);

        tvTitle.setText(movie.getTitle());

        // Remove the movie from the list on button click and update the adapter.
        btnDelete.setOnClickListener(v -> {
            movies.remove(movie);
            notifyDataSetChanged();
        });

        return view;
    }
}
