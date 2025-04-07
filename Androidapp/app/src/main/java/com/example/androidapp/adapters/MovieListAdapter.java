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

import java.util.ArrayList;
import java.util.List;

public class MovieListAdapter extends BaseAdapter {

    public interface OnMovieActionListener {
        void onEditClicked(Movie movie);
        void onDeleteClicked(Movie movie);
    }

    private List<Movie> movies = new ArrayList<>();
    private final LayoutInflater inflater;
    private final OnMovieActionListener actionListener;
    private final boolean showEditButton;

    public MovieListAdapter(Context context, OnMovieActionListener actionListener, boolean showEditButton) {
        this.inflater = LayoutInflater.from(context);
        this.actionListener = actionListener;
        this.showEditButton = showEditButton;
    }

    public void updateMovies(List<Movie> movies) {
        this.movies = movies != null ? movies : new ArrayList<>();
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
        return movies.get(position).get_id().hashCode();
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder holder;
        if (convertView == null) {
            convertView = inflater.inflate(R.layout.item_movie_delete, parent, false);
            holder = new ViewHolder();
            holder.tvTitle = convertView.findViewById(R.id.tvMovieTitle);
            holder.btnEdit = convertView.findViewById(R.id.btnEdit);
            holder.btnDelete = convertView.findViewById(R.id.btnDelete);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }

        Movie movie = getItem(position);
        holder.tvTitle.setText(movie.getTitle());

        // Set up edit button
        if (showEditButton) {
            holder.btnEdit.setVisibility(View.VISIBLE);
            holder.btnEdit.setOnClickListener(v -> {
                if (actionListener != null) {
                    actionListener.onEditClicked(movie);
                }
            });
        } else {
            holder.btnEdit.setVisibility(View.GONE);
        }

        // Set up delete button
        holder.btnDelete.setOnClickListener(v -> {
            if (actionListener != null) {
                actionListener.onDeleteClicked(movie);
            }
        });

        return convertView;
    }

    private static class ViewHolder {
        TextView tvTitle;
        Button btnEdit;
        Button btnDelete;
    }
}