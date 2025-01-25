const Movie = require("../models/Movie");
const User = require("../models/User");
const validator = require("../utils/validator");
const mongoose = require("mongoose");

class recommendationRepository {
  async getMovieById(movieId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(movieId)) {
        throw new Error(`Invalid movie ID: ${movieId}`);
      }
      return await Movie.findById(movieId);
    } catch (error) {
      console.error(`Error fetching movie with ID ${movieId}:`, error);
      return null;
    }
  }

  async addToWatchList(userId, movieId) {
    // Add the movieID to the user's watch list
    const user = await User.findById(userId);
    if (!user.watchList.includes(movieId)) {
      user.watchList.push(movieId);
      await user.save(); // Save the updated user to the database
    }

    // Add the user to the movie's watchedBy array
    const movie = await Movie.findById(movieId);
    if (!movie.watchedBy.includes(userId)) {
      movie.watchedBy.push(userId);
      await movie.save(); // Save the updated movie to the database
    }
  }
}
module.exports = new recommendationRepository();
