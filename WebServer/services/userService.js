const User = require('../models/User');
const movieRepository = require('../repositories/movieRepository');
const userRepository = require('../repositories/userRepository');
const validator = require('../utils/validator');
const Movie = require('../models/Movie');
const mongoose = require('mongoose');
const { generateToken } = require('../controllers/tokensController');


const createUser = async (userData) => {
    const requiredFields = ['user_name','nickName', 'password', 'mail', 'phone'];
    const missingFields = requiredFields.filter(field => !userData[field]);
    if (missingFields.length > 0) {
    throw new Error(`Validation Error: Missing fields - ${missingFields.join(", ")}`);
}
    validator.validUsername(userData.user_name);
    validator.validPassword(userData.password);
    validator.validEmail(userData.mail);
    validator.validPhone(userData.phone);
    if (userData.watchList){
    for (const movieId of userData.watchList) {
                if (!mongoose.Types.ObjectId.isValid(movieId)) {
                    throw new Error(`Invalid movie ID: ${movieId}`);
                }
        
                const movieExists = await movieRepository.getById(movieId);
                if (!movieExists) {
                    throw new Error(`movie not found: ${movieId}`);
                }
            }
        }
    const user = await userRepository.createUser(userData);  
    if (userData.watchList && userData.watchList.length > 0) {
        for (const movieId of userData.watchList) {
            const movie = await Movie.findById(movieId);
            if (movie) {
                if (!movie.watchedBy) {
                    movie.watchedBy = [];
                }
                movie.watchedBy.push(user._id);
                await movie.save();
            }
        }
    }
    // Generate a token for the user
    const token = generateToken(user);
    return { user, token };
    };
    const getUser = async (id) => {
        const user = await userRepository.getUser(id);
        if (!user) {
            throw new Error({ errors: ['User not found'] });
        }
        const userData = {
          user_name: user.user_name,
          nickName: user.nickName,
          mail: user.mail,
          phone: user.phone,
          picture: user.picture,
          manager: user.manager,
        }
        return userData;
    };

    const updateUserWatchlist = async (userId, movieId) => {
        // Validate user exists
        const existingUser = await userRepository.getUser(userId);
        if (!existingUser) {
            throw new Error('User not found');
        }
    
        // Validate movieId format
        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            throw new Error(`Invalid movie ID: ${movieId}`);
        }

        // Check if movie exists
        const movie = await movieRepository.getById(movieId);
        if (!movie) {
            throw new Error(`Movie not found: ${movieId}`);
        }
        return await userRepository.updateUserWatchlist(userId, movieId);
    };

module.exports = {createUser,getUser,updateUserWatchlist}