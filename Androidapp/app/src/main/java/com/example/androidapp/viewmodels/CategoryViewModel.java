package com.example.androidapp.viewmodels;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.example.androidapp.CategoryResponse;
import com.example.androidapp.MyApplication;
import com.example.androidapp.entities.Category;
import com.example.androidapp.repositories.CategoryRepository;

import org.jetbrains.annotations.Async;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import okhttp3.ResponseBody;
import retrofit2.Callback;

public class CategoryViewModel extends ViewModel {

    private CategoryRepository categoryRepository;
    private MutableLiveData<List<Category>> categories;

    private  ExecutorService executorService;

    MyApplication app = MyApplication.getInstance();

    public CategoryViewModel() {
        categoryRepository = new CategoryRepository(app.getAppContext());
        categories = new MutableLiveData<>();
        categories.setValue(categoryRepository.getAllCategories().getValue());
        executorService = Executors.newSingleThreadExecutor();
    }

    public interface CategoryNameCallback {
        void onCategoryNameFetched(String categoryName);
    }

    // Expose the data as immutable LiveData
    public LiveData<List<Category>> getCategories() {
        return categoryRepository.getAllCategories();
    }

    public LiveData<Category> getCategoryByName(String name) {
        return categoryRepository.getCategoryByName(name);
    }

    public void deleteCategory(Category category, Callback<Void> callback) {
        categoryRepository.deleteCategoryFromServer(category, callback);
    }


    public void addCategory(Category category, Callback<CategoryResponse> callback) {
        categoryRepository.addCategoryToServer(category, callback);
    }

    public void updateCategory(Category category, Callback<Category> callback) {
        categoryRepository.updateCategoryOnServer(category, callback);
    }
    public void updateCategorySelection(int categoryId, boolean isSelected) {
        categoryRepository.updateCategorySelection(categoryId, isSelected);
    }
    // Change this synchronous method to use background thread
    public void getCategoryNameByServerId(String serverId, CategoryNameCallback callback) {
        executorService.execute(() -> {
            String categoryName = categoryRepository.getCategoryNameByServerId(serverId);
            // Post result back to main thread
            // You may need to use a handler or LiveData to post back to main thread
            callback.onCategoryNameFetched(categoryName);
        });
    }

    public LiveData<List<Category>> getSelectedCategories() {
        return categoryRepository.getSelectedCategories();
    }

}