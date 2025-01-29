const movieRepository = require("../repositories/movieRepository");
const categoryRepository = require("../repositories/categoryRepository");
const userRepository = require("../repositories/userRepository");
const recommendationService = require("./recommendationService");
const Category = require("../models/Category");
const Movie = require("../models/Movie");
const User = require("../models/User");
const validator = require("../utils/validator");
const mongoose = require("mongoose");

class movieService {
  async getAll(userId) {
    try {
      //Validate user
      const user = await userRepository.getUser(userId);
      if (!user) {
        throw new Error("User not found");
      }

      //Create an empty response object - will add recently watched and promoted categories
      const response = {};

      // Recently watched movies
      if (user.watchList && user.watchList.length > 0) {
        const recentMovieIds = user.watchList.slice(-20);
        const recentMovies = await movieRepository.getMoviesByIds(
          recentMovieIds
        );
        response["Recently Watched"] = this._getRandomMovies(
          recentMovies,
          recentMovies.length
        );
      }

      // Promoted categories
      const promotedCategories = await Category.find({ promoted: true });
      const watchedMoviesIds = new Set(
        user.watchList.map((id) => id.toString())
      );

      // Get 20 random movies from each promoted category
      for (const category of promotedCategories) {
        const unwatchedMovies = await movieRepository.getMoviesByCategory(
          category._id,
          Array.from(watchedMoviesIds)
        );

        if (unwatchedMovies.length > 0) {
          response[category.name] = this._getRandomMovies(unwatchedMovies, 20);
        }
      }

      return response;
    } catch (error) {
      throw new Error(`Failed to get movies recommendations: ${error.message}`);
    }
  }

  _getRandomMovies(movies, count) {
    const shuffled = [...movies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  async getById(id) {
    // validator.validId(id);
    const movie = await movieRepository.getById(id);
    if (!movie) {
      throw new Error("movie not found");
    }
    return movie;
  }

  async create(movieData) {
    try {
      const movie = new Movie(movieData);
      await movie.save();

      try {
        // Add the movie to categories
        for (const categoryId of movieData.categories) {
          const category = await Category.findById(categoryId);
          category.movies.push(movie._id);
          await category.save();
        }
      } catch (error) {
        await Movie.findByIdAndDelete(movie._id);
        throw new Error(
          "Failed to update categories. Movie creation rolled back."
        );
      }

      return movie;
    } catch (error) {
      throw error;
    }
  }

  async update(id, newData) {
    validator.validId(id);
    const existingMovie = await movieRepository.getById(id);
    if (!existingMovie) {
      throw new Error("Movie not found");
    }
    if (newData.categories) {
      const categoriesToRemoveFrom = existingMovie.categories.filter(
        (oldCatId) => !newData.categories.includes(oldCatId.toString())
      );

      for (const categoryId of categoriesToRemoveFrom) {
        const category = await categoryRepository.getById(categoryId);
        if (category) {
          category.movies = category.movies.filter(
            (movieId) => movieId.toString() !== id
          );
          await categoryRepository.update(categoryId, {
            movies: category.movies,
          });
        }
      }

      const categoriesToAddTo = newData.categories.filter(
        (newCatId) =>
          !existingMovie.categories
            .map((cat) => cat.toString())
            .includes(newCatId)
      );

      for (const categoryId of categoriesToAddTo) {
        const category = await categoryRepository.getById(categoryId);
        if (category) {
          category.movies.push(id);
          await categoryRepository.update(categoryId, {
            movies: category.movies,
          });
        }
      }
    }
    this.removeFromSources(id);
    return await movieRepository.update(id, newData);
  }

  async removeFromSources(id) {
    const existingMovie = await movieRepository.getById(id);
    if (!existingMovie) {
      throw new Error("Movie not found");
    }
    const users = await User.find({ watchList: id });
    for (const user of users) {
      user.watchList = user.watchList.filter(
        (movieId) => movieId.toString() !== id.toString()
      );
      await user.save();
      //delete movie from recommendations Service
      try {
        await recommendationService.deleteFromWatchList(
          user._id.toString(),
          id
        );
      } catch (error) {
        console.log(
          `Failed to delete movie ${id} from recommendations for user ${user._id}: ${error.message}`
        );
      }
    }
    if (existingMovie.categories && existingMovie.categories.length > 0) {
      for (const categoryId of existingMovie.categories) {
        const category = await categoryRepository.getById(categoryId);
        if (category) {
          category.movies = category.movies.filter(
            (movieId) => movieId.toString() !== id.toString()
          );
          await categoryRepository.update(categoryId, {
            movies: category.movies,
          });
        }
      }
    }
  }
  async delete(id) {
    try {
      await validator.validId(id);
      await validator.isMovieExist(id);
      this.removeFromSources(id);
      return await movieRepository.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete movie: ${error.message}`);
    }
  }
  async search(query) {
    try {
      return await movieRepository.search(query);
    } catch (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
  }
}
module.exports = new movieService();
