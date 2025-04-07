package com.example.androidapp.activities;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.androidapp.viewmodels.CategoryViewModel;
import com.example.androidapp.viewmodels.MainViewModel;
import com.example.androidapp.entities.Movie;
import com.example.androidapp.R;
import com.example.androidapp.entities.Section;
import com.example.androidapp.adapters.SectionAdapter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class MoviesActivity extends AppCompatActivity {

    private RecyclerView sectionRecyclerView;
    private EditText searchBar;
    private ImageView menuSearch;
    private Spinner categoryFilter;
    private SectionAdapter sectionAdapter;
    private MainViewModel viewModel;

    private CategoryViewModel categoryViewModel;

    private List<Movie> allMovies = new ArrayList<>();
    private List<Section> originalSections = new ArrayList<>();
    private Set<String> allCategories = new HashSet<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_movies);

        sectionRecyclerView = findViewById(R.id.sectionRecyclerView);
        searchBar = findViewById(R.id.searchBar);
        menuSearch = findViewById(R.id.menuSearch);
        categoryFilter = findViewById(R.id.categoryFilter);

        sectionRecyclerView.setLayoutManager(new LinearLayoutManager(this));

        viewModel = new ViewModelProvider(this).get(MainViewModel.class);
        categoryViewModel = new ViewModelProvider(this).get(CategoryViewModel.class);

        viewModel.getAllMovies().observe(this, movies -> {
            this.allMovies = movies;
            groupMoviesByCategory(movies, sections -> {
                originalSections = sections;
                updateRecyclerWithSections(originalSections);
            });
            extractCategories(movies);
        });

        menuSearch.setOnClickListener(v -> {
            if (searchBar.getVisibility() == View.GONE) {
                searchBar.setVisibility(View.VISIBLE);
                searchBar.requestFocus();
            } else {
                searchBar.setVisibility(View.GONE);
                searchBar.setText("");
                updateRecyclerWithSections(originalSections);
            }
        });

        searchBar.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void afterTextChanged(Editable s) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                filterMovies(s.toString());
            }
        });

        categoryFilter.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String selectedCategory = parent.getItemAtPosition(position).toString();
                if (selectedCategory.equals("All Categories")) {
                    updateRecyclerWithSections(originalSections);
                } else {
                    filterByCategory(selectedCategory);
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {}
        });

        setupMenuClicks();
    }

    private void setupMenuClicks() {
        TextView menuHome = findViewById(R.id.menuHome);
        TextView menuMovies = findViewById(R.id.menuMovies);
        TextView menuAdmin = findViewById(R.id.menuAdmin);
        TextView menuLogout = findViewById(R.id.menuLogout);

        menuHome.setOnClickListener(v -> updateRecyclerWithSections(originalSections));
        menuMovies.setOnClickListener(v -> filterByKeyword("movie"));
        menuAdmin.setOnClickListener(v -> {
            Intent intent = new Intent(MoviesActivity.this, AdminActivity.class);
            startActivity(intent);
            // Navigate to admin activity
        });
        menuLogout.setOnClickListener(v -> finish());
    }

    private void filterByKeyword(String keyword) {
        List<Movie> filtered = new ArrayList<>();
        for (Movie movie : allMovies) {
            if (movie.getTitle().toLowerCase().contains(keyword.toLowerCase()) ||
                    movie.getDescription().toLowerCase().contains(keyword.toLowerCase())) {
                filtered.add(movie);
            }
        }
        updateRecyclerWithMovies(filtered, "Filtered: " + keyword);
    }

    private void filterMovies(String query) {
        if (query.isEmpty()) {
            updateRecyclerWithSections(originalSections);
            return;
        }

        List<Movie> filtered = new ArrayList<>();
        for (Movie movie : allMovies) {
            if (movie.getTitle().toLowerCase().contains(query.toLowerCase())) {
                filtered.add(movie);
            }
        }
        updateRecyclerWithMovies(filtered, "Search Results");
    }

    private void filterByCategory(String category) {
        List<Movie> filtered = new ArrayList<>();
        for (Movie movie : allMovies) {
            if (movie.getCategories() != null && movie.getCategories().contains(category)) {
                filtered.add(movie);
            }
        }
        updateRecyclerWithMovies(filtered, category);
    }

    private void extractCategories(List<Movie> movies) {
        allCategories.clear();
        for (Movie movie : movies) {
            if (movie.getCategories() != null) {
                allCategories.addAll(movie.getCategories());
            }
        }
        List<String> categoryList = new ArrayList<>(allCategories);
        Collections.sort(categoryList);
        categoryList.add(0, "All Categories");
        ArrayAdapter<String> adapter = new ArrayAdapter<>(
                this,
                android.R.layout.simple_spinner_item,
                categoryList
        );
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        categoryFilter.setAdapter(adapter);
    }

    private void updateRecyclerWithSections(List<Section> sections) {
        sectionAdapter = new SectionAdapter(this, sections);
        sectionRecyclerView.setAdapter(sectionAdapter);
    }

    private void updateRecyclerWithMovies(List<Movie> movies, String title) {
        List<Section> sections = Collections.singletonList(new Section(title, movies));
        updateRecyclerWithSections(sections);
    }

    private void groupMoviesByCategory(List<Movie> movies, GroupCategoriesCallback callback) {
        Map<String, List<Movie>> categoryMap = new HashMap<>();

        // First group movies by category ID
        for (Movie movie : movies) {
            if (movie.getCategories() != null) {
                for (String categoryId : movie.getCategories()) {
                    categoryMap.computeIfAbsent(categoryId, k -> new ArrayList<>()).add(movie);
                }
            }
        }

        // Track pending name lookups
        final int[] pendingLookups = {categoryMap.size()};

        if (pendingLookups[0] == 0) {
            callback.onCategoriesGrouped(new ArrayList<>());
            return;
        }

        List<Section> sections = new ArrayList<>();

        // Get category names for each ID
        for (Map.Entry<String, List<Movie>> entry : categoryMap.entrySet()) {
            String categoryId = entry.getKey();
            List<Movie> categoryMovies = entry.getValue();

            // Get the category name instead of using the ID
            categoryViewModel.getCategoryNameByServerId(categoryId, categoryName -> {
                sections.add(new Section(categoryName, categoryMovies));

                // If all categories processed, return result
                pendingLookups[0]--;
                if (pendingLookups[0] == 0) {
                    callback.onCategoriesGrouped(sections);
                }
            });
        }
    }

    // Callback interface
    interface GroupCategoriesCallback {
        void onCategoriesGrouped(List<Section> sections);
    }
}