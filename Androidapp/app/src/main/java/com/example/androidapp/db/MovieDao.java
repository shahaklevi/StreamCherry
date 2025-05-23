package com.example.androidapp.db;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import androidx.room.Transaction;
import androidx.room.Update;

import com.example.androidapp.entities.Movie;

import java.util.List;

@Dao
public interface MovieDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertMovies(List<Movie> movies);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insert(Movie movie);

    @Update
    void updateMovie(Movie movie);

    @Query("DELETE FROM movies")
    void deleteAllMovies();
    @Transaction
    default void clearAndInsertMovies(List<Movie> movies) {
        deleteAllMovies();
        insertMovies(movies);
    }
    @Query("DELETE FROM movies WHERE _id = :movieId")
    void deleteMovie(String movieId);
    @Query("SELECT * FROM movies WHERE title LIKE :query")
    LiveData<List<Movie>> searchMovies(String query);
    @Query("SELECT * FROM movies")
    LiveData<List<Movie>> getAllMovies();
}