const categoryRepository = require('../repositories/categoryRepository');
const mongoose = require('mongoose');
const validator = require('../utils/validator');
const Category = require('../models/Category');
const Movie = require('../models/Movie');
const movieService = require('./movieService');

class CategoryService {
    async getAll() {
        return await categoryRepository.getAll();
    }
    async getById(id) {
        validator.validId(id);
        const category = await categoryRepository.getById(id);
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    }


    async create(categoryData) {
        // Validate required field
        validator.validRequired(categoryData.name, 'Name');
        // Validate promoted (if provided)
        if (categoryData.promoted !== undefined && typeof categoryData.promoted !== 'boolean') {
            throw new Error('Promoted must be a boolean');
        }

        // Update movies with the new category
        if (categoryData.movies) {
            for (const movieId of categoryData.movies) {
                if (!mongoose.Types.ObjectId.isValid(movieId)) {
                    throw new Error(`Invalid movie ID: ${movieId}`);
                }
                const movieExists = await Movie.findById(movieId);
                if (!movieExists) {
                    throw new Error(`Movie not found: ${movieId}`);
                }
            }
        }
        // Create category
        const category = await categoryRepository.create(categoryData);
        if (categoryData.movies) {
            for (const movieId of categoryData.movies) {
                const movie = await Movie.findById(movieId);
                if (movie) {
                    if (!movie.categories.includes(category._id)) {
                        await movie.categories.push(category._id);
                        await movie.save();
                    }
                }
            }
        }
        return category;
    }


    async update(id, newData) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Category not found');
        }

        const existingCategory = await categoryRepository.getById(id);
        if (!existingCategory) {
            throw new Error('Category not found');
        }

        // Validate name (if provided)
        if (newData.name) {
            await validator.validUnique(Category, 'Name', newData.name);
        }

        // Validate promoted (if provided)
        if (newData.promoted !== undefined && typeof newData.promoted !== 'boolean') {
            throw new Error('Promoted must be a boolean');
        }

        // Validate movies (if provided)
        if (newData.movies) {
            if (!Array.isArray(newData.movies)) {
                throw new Error('Movies must be an array of IDs');
            }

            for (const movieId of newData.movies) {
                if (!mongoose.Types.ObjectId.isValid(movieId)) {
                    throw new Error(`Invalid movie ID: ${movieId}`);
                }
                const movieExists = await Movie.findById(movieId);
                if (!movieExists) {
                    throw new Error(`Movie not found: ${movieId}`);
                }
            }

            // Update categories in the Movie model
            const oldMovies = existingCategory.movies;
            const newMovies = newData.movies;

            // Remove the category from movies that are no longer in the list
            for (const movieId of oldMovies) {
                if (!newMovies.includes(movieId.toString())) {
                    const movie = await Movie.findById(movieId);
                    if (movie) {
                        movie.categories = movie.categories.filter(
                            (categoryId) => categoryId.toString() !== id
                        );
                        await movie.save();

                        // Delete the movie if no categories remain
                        if (movie.categories.length === 0) {
                            await Movie.findByIdAndDelete(movieId);
                        }
                    }
                }
            }

            // Add the category to movies in the new list
            for (const movieId of newMovies) {
                const movie = await Movie.findById(movieId);
                if (movie && !movie.categories.includes(id)) {
                    movie.categories.push(id);
                    await movie.save();
                }
            }
        }

        // Merge existing data with new data
        const updatedCategory = { ...existingCategory.toObject(), ...newData };

        return await categoryRepository.update(id, updatedCategory);
    }


    async delete(id) {
        validator.validId(id);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Category not found');
        }

        const category = await categoryRepository.getById(id);
        if (!category) {
            throw new Error('Category not found');
        }

        // Get all movies associated with the category
        const movies = await Movie.find({ categories: id });

        for (const movie of movies) {
            // Remove the category from the movie
            movie.categories = movie.categories.filter(
                (categoryId) => categoryId.toString() !== id
            );

            // Save the updated movie
            if (movie.categories.length === 0) {
                // Delete the movie if it has no categories
                // await Movie.findByIdAndDelete(movie._id);
                await movieService.delete(movie._id);
            } else {
                await movie.save();
            }
        }

        // Delete the category itself
        return await categoryRepository.delete(id);
    }


    async getPromotedCategories() {
        const promotedCategories = await categoryRepository.findByCondition({ isPromoted: true });
        return promotedCategories;
    }
}


module.exports = new CategoryService();
