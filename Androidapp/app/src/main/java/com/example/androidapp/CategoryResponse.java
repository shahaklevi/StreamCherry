package com.example.androidapp;
import com.example.androidapp.entities.Category;
import com.google.gson.annotations.SerializedName;

public class CategoryResponse {

    @SerializedName("category")
    private Category category;

    // Default constructor
    public CategoryResponse() {}

    // Getter for the category field
    public Category getCategory() {
        return category;
    }

    // Setter for the category field
    public void setCategory(Category category) {
        this.category = category;
    }

    @Override
    public String toString() {
        return "CategoryResponse{" +
                "category=" + category +
                '}';
    }
}
