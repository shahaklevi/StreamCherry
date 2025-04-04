package com.example.androidapp.entities;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;

import com.google.gson.annotations.SerializedName;

import java.util.List;

@Entity
public class Category {

    @PrimaryKey
    @NonNull
    @SerializedName("_id")
    private String ServerId;
    private String name;
    @Ignore
    private List<String> movies;
    private boolean promoted;
    private boolean isSelected;
    // No-arg constructor that Room will use
    public Category() {
    }
    // Parameterized constructor for convenience - not used by Room
    @Ignore
    public Category(String name, boolean promoted) {
        this.name = name;
        this.promoted = promoted;
    }

    // Another parameterized constructor for convenience - not used by Room
    @Ignore
    public Category(String name, List<String> movies, boolean promoted) {
        this.name = name;
        this.movies = movies;
        this.promoted = promoted;
    }

    @NonNull
    public String getName() {
        return name;
    }

    public List<String> getMovies() {
        return movies;
    }

    public boolean isPromoted() {
        return promoted;
    }


    public void setName(@NonNull String name) {
        this.name = name;
    }

    public void setMovies(List<String> movies) {
        this.movies = movies;
    }

    public void setPromoted(boolean promoted) {
        this.promoted = promoted;
    }

    public String getServerId() {
        return ServerId;
    }

    public void setServerId(String serverId) {
        ServerId = serverId;
    }

    public boolean isSelected() {
        return isSelected;
    }

    public void setSelected(boolean selected) {
        isSelected = selected;
    }
}
