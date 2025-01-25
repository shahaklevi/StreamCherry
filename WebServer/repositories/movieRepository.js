const Movie = require('../models/Movie');

class movieRepository {

    async getMoviesByCategory(categoryId, excludeMovieIds) {
        try {
            return await Movie.find({
                categories: categoryId,
                _id: { $nin: excludeMovieIds }
            }).exec();
        } catch (error) {
            throw new Error(`Failed to fetch movies by category: ${error.message}`);
        }
    }
    async getMoviesByIds(movieIds) {
        try {
            return await Movie.find({'_id': { $in: movieIds }
            });
        } catch (error) {
            throw new Error(`Failed to fetch movies by IDs: ${error.message}`);
        }
    }

    async getById(id) {
        return await Movie.findById(id);
    }

    async create(movieData) {
        // Explicitly construct the movie object
        const movie = new Movie({
            title: movieData.title,
            description: movieData.description,
            releaseYear: movieData.releaseYear,
            duration: movieData.duration,
            categories: movieData.categories,
            rating: movieData.rating,
            cast: movieData.cast,
            image: movieData.image,
            videoUrl: movieData.videoUrl,
            createdAt: movieData.createdAt || Date.now(),
            watchedBy: [] // Explicitly set to an empty array
        });
    
        return await movie.save();
    }
    

    async update(id, movieData) {
        const movie = await Movie.findById(id);
        if(!movie) {
            return null;
        }
        Object.assign(movie, movieData);
        return await movie.save();
    }

    async delete(id) {
        return await Movie.findByIdAndDelete(id);
    }
    async search(query) {
        try {
            return await Movie.find({
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                    { cast: { $regex: query, $options: 'i' } }
                ]
            });
        } catch (error) {
            throw new Error(`Search failed: ${error.message}`);
        }
    }
}

module.exports = new movieRepository();