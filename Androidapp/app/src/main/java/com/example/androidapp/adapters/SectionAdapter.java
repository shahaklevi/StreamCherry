package com.example.androidapp.adapters;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.androidapp.R;
import com.example.androidapp.entities.Section;
import com.example.androidapp.activities.PlayerActivity;

import java.util.List;
import java.util.Random;

public class SectionAdapter extends RecyclerView.Adapter<SectionAdapter.SectionViewHolder> {
    private List<Section> sections;
    private Context context;

    public SectionAdapter(Context context, List<Section> sections) {
        this.context = context;
        this.sections = sections;
    }

    public static class SectionViewHolder extends RecyclerView.ViewHolder {
        TextView sectionTitle;
        RecyclerView moviesRecyclerView;

        public SectionViewHolder(View itemView) {
            super(itemView);
            sectionTitle = itemView.findViewById(R.id.sectionTitle);
            moviesRecyclerView = itemView.findViewById(R.id.moviesRecyclerView);
        }
    }

    @NonNull
    @Override
    public SectionViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_section, parent, false);
        return new SectionViewHolder(view);
    }

    private String getRandomYouTubeUrl() {
        String[] urls = {
                "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "https://www.youtube.com/watch?v=9bZkp7q19f0",
                "https://www.youtube.com/watch?v=3JZ_D3ELwOQ"
        };
        return urls[new Random().nextInt(urls.length)];
    }


    @Override
    public void onBindViewHolder(@NonNull SectionViewHolder holder, int position) {
        Section section = sections.get(position);
        holder.sectionTitle.setText(section.getTitle());

        MovieAdapter movieAdapter = new MovieAdapter(context, section.getMovies(), movie -> {
            Intent intent = new Intent(context, PlayerActivity.class);
            String fileUrl = "http://10.0.2.2:3000/" + movie.getMovieFile();
            intent.putExtra("VIDEO_URL",fileUrl);
            context.startActivity(intent);
        });        holder.moviesRecyclerView.setLayoutManager(new LinearLayoutManager(context, LinearLayoutManager.HORIZONTAL, false));
        holder.moviesRecyclerView.setAdapter(movieAdapter);
    }

    @Override
    public int getItemCount() {
        return sections.size();
    }
}
