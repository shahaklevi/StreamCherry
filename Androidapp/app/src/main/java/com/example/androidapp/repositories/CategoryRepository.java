package com.example.androidapp.repositories;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.androidapp.CategoryResponse;
import com.example.androidapp.api.CategoryApi;
import com.example.androidapp.db.AppDB;
import com.example.androidapp.db.CategoryDao;
import com.example.androidapp.entities.Category;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.Executors;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class CategoryRepository {

    static final String TAG = "CategoryRepository";
    private CategoryDao categoryDao;
    private CategoryListData categoryListData;
    private CategoryApi categoryApi;

    public CategoryRepository(Context context) {
        AppDB db = AppDB.getInstance(context);
        categoryDao = db.categoryDao();
        categoryListData = new CategoryListData();
        categoryApi = new CategoryApi();
    }

    class CategoryListData extends MutableLiveData<List<Category>> {
        public CategoryListData(){
            super();
            new Thread(() -> {
                List<Category> categories = categoryDao.getAllCategories();
                postValue(categories);
            }).start();
        }


        @Override
        protected void onActive() {
            super.onActive();

            // Load initial data from local database
            loadFromLocalDatabase();

            // Fetch fresh data from API and sync
            fetchAndSyncWithApi();
        }

        private void loadFromLocalDatabase() {
            Executors.newSingleThreadExecutor().execute(() -> {
                try {
                    List<Category> localCategories = categoryDao.getAllCategories();
                    postValue(localCategories);
                } catch (Exception e) {
                    Log.e("CategoryRepo", "error in loading categories from local database", e);
                }
            });
        }

        private void fetchAndSyncWithApi() {
            Log.d("API", "Starting to fetch categories from server");

            categoryApi.getCategories(new Callback<List<Category>>() {
                @Override
                public void onResponse(Call<List<Category>> call, Response<List<Category>> response) {
                    if (response.isSuccessful() && response.body() != null) {
                        Log.d("API", "Got successful response with categories");

                        // Replace with transaction-based approach
                        replaceLocalCategories(response.body());
                    } else {
                        Log.w("API", "Server response problem: " +
                                (response.code() + " " + response.message()));
                    }
                }

                @Override
                public void onFailure(Call<List<Category>> call, Throwable t) {
                    Log.e("API", "Failed to call API", t);
                }
            });
        }

        private void replaceLocalCategories(List<Category> serverCategories) {
            Executors.newSingleThreadExecutor().execute(() -> {
                try {
                    // Use transaction to ensure atomicity
                    categoryDao.clearAndInsertCategories(serverCategories);

                    // Get updated list and notify observers
                    List<Category> updatedCategories = categoryDao.getAllCategories();
                    postValue(updatedCategories);
                    Log.d("API", "Updated local database with " + serverCategories.size() + " categories");
                } catch (Exception e) {
                    Log.e("DB", "Error replacing categories", e);
                }
            });
        }

        @Override
        protected void onInactive() {
            super.onInactive();
        }
    }

    // Ensure these methods are inside the CategoryRepository class
    public MutableLiveData<List<Category>> getAllCategories() {
        return categoryListData;
    }

    public void deleteCategoryFromServer(Category category, Callback<Void> callback) {
        // נניח שהקטגוריה כוללת שדה serverId, שהוא המזהה שמגיע מהשרת (MongoDB)
        String serverId = category.getServerId();
        new Thread(() -> {
            categoryDao.delete(category);
            List<Category> categories = categoryDao.getAllCategories();
            categoryListData.postValue(categories);
        }).start();


        // קריאה למחיקת הקטגוריה מהשרת
        categoryApi.deleteCategory(serverId, new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if(response.isSuccessful()){
                    Log.d("CategoryRepo", "Category deleted successfully from server");
                    // מחיקה ממסד הנתונים המקומי
                    new Thread(() -> {
                        categoryDao.delete(category);
                        List<Category> categories = categoryDao.getAllCategories();
                        categoryListData.postValue(categories);
                    }).start();
                } else {
                    Log.e("CategoryRepo", "Failed to delete category, code: " + response.code());
                }
                callback.onResponse(call, response);
            }
            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Log.e("CategoryRepo", "Error deleting category from server", t);
                callback.onFailure(call, t);
            }
        });
    }

    public void addCategoryToServer(Category category, Callback<CategoryResponse> callback) {
        // קריאה לשרת להוספת קטגוריה באמצעות העוטף CategoryResponse
        categoryApi.addCategory(category, new Callback<CategoryResponse>() {
            @Override
            public void onResponse(Call<CategoryResponse> call, Response<CategoryResponse> response) {
                if(response.isSuccessful() && response.body() != null) {
                    Log.d(TAG, response.body().toString());
                    // עדכון מסד הנתונים המקומי עם הקטגוריה שהתקבלה מהשרת
                    new Thread(() -> {
                        // חילוץ האובייקט Category מתוך העוטף
                        Category returnedCategory = response.body().getCategory();
                        if (returnedCategory != null) {
                            category.setServerId(returnedCategory.getServerId());
                        }
                        categoryDao.insert(category);
                        List<Category> updatedCategories = categoryDao.getAllCategories();
                        categoryListData.postValue(updatedCategories);
                    }).start();
                }
                callback.onResponse(call, response);
            }

            @Override
            public void onFailure(Call<CategoryResponse> call, Throwable t) {
                callback.onFailure(call, t);
            }
        });
    }



    public void updateCategoryOnServer(Category category, Callback<Category> callback) {
        // First get the current category from DB to ensure we have the correct ID
        Executors.newSingleThreadExecutor().execute(() -> {
            Category existingCategory = categoryDao.getCategoryByServerId(category.getServerId());

            if (existingCategory != null) {
                // Delete the old version first
                categoryDao.delete(existingCategory);

                // Now make the API call to update on server
                categoryApi.updateCategory(category, new Callback<Category>() {
                    @Override
                    public void onResponse(@NonNull Call<Category> call, @NonNull Response<Category> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            // Insert the updated category
                            Category updatedCategory = response.body();
                            Executors.newSingleThreadExecutor().execute(() -> {
                                categoryDao.insert(updatedCategory);
                                List<Category> updatedCategories = categoryDao.getAllCategories();
                                categoryListData.postValue(updatedCategories);
                            });
                        }
                        callback.onResponse(call, response);
                    }

                    @Override
                    public void onFailure(@NonNull Call<Category> call, @NonNull Throwable t) {
                        // If update fails, restore the original category
                        Executors.newSingleThreadExecutor().execute(() -> {
                            categoryDao.insert(existingCategory);
                            categoryListData.postValue(categoryDao.getAllCategories());
                        });
                        callback.onFailure(call, t);
                    }
                });
            } else {
                // Handle case where category doesn't exist
                callback.onFailure(null, new Exception("Category not found in local database"));
            }
        });
    }


    public String getCategoryNameByServerId(String serverId) {
        String categoryName = categoryDao.getCategoryNameByServerId(serverId);
        // Return a fallback value instead of null to prevent sorting issues
        return categoryName != null ? categoryName : "Action1";
    }
    public LiveData<Category> getCategoryByName(String name) {
        return categoryDao.getCategoryByName(name);
    }

    public void updateCategorySelection(int categoryId, boolean isSelected) {
        new Thread(() -> {
            categoryDao.updateSelection(categoryId, isSelected);
        }).start();
    }

    public LiveData<List<Category>> getSelectedCategories() {
        return categoryDao.getSelectedCategories();
    }
}