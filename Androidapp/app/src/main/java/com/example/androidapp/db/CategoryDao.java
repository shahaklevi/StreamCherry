package com.example.androidapp.db;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import androidx.room.Update;

import com.example.androidapp.entities.Category;

import java.util.List;

@Dao
public interface CategoryDao {


    @Query("SELECT * FROM category")
    List<Category> getAllCategories();
    @Query("SELECT * FROM category WHERE name = :name")
    LiveData<Category> getCategoryByName(String name);
    @Query("UPDATE category SET isSelected = :isSelected WHERE serverId = :categoryId")
    void updateSelection(int categoryId, boolean isSelected);

    @Query("SELECT * FROM category WHERE name = :name LIMIT 1")
    Category getCategoryByNameSync(String name);

    @Query("SELECT * FROM category WHERE isSelected = 1")
    LiveData<List<Category>> getSelectedCategories();

    @Insert(onConflict = OnConflictStrategy.REPLACE) // Replace existing entries
    void insert(Category category);

    @Update
    void update(Category... categories);

    @Delete
    void delete(Category... categories);

}