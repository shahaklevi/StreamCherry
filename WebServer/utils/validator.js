const mongoose = require('mongoose');
const User = require('../models/User');
const Movie = require('../models/Movie');
const movieRepository = require('../repositories/movieRepository');
const categoryRepository = require('../repositories/categoryRepository');
const Category = require('../models/Category');




// Validate ObjectId
const validId = (id) => {
    if (!id) {
        throw new Error('Id is required');
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid id format');
    }
};

// Validate string length
const validStringLength = (data, field, min, max) => {
    if (data.length < min || data.length > max) {
        throw new Error(`${field} length must be between ${min} and ${max}`);
    }
};

// Validate unique value
const validUnique = async (Model, field, value) => {
    const query = {};
    query[field] = value.trim();
    const exists = await Model.findOne(query);
    if (exists) {
        throw new Error(`${field} must be unique`);
    }
};

// Validate required fields
const validRequired = (data, field) => {
    if (!data || data.trim().length === 0) {
        throw new Error(`${field} is required`);
    }
};
const validEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
    if (!email || !emailRegex.test(email)) {
        throw new Error('Invalid email format. Please provide a valid email address.');
    }
};

// Validate phone number format
const validPhone = (phone) => {
    const phoneRegex = /^\d{10}$/; // Matches exactly 10 digits
    if (!phone || !phoneRegex.test(phone)) {
        throw new Error('Invalid phone number. Please provide a valid 10-digit phone number.');
    }
};

// Validate username format
const validUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/; // Allows letters, numbers, and underscores, 3-20 characters
    if (!username || !usernameRegex.test(username)) {
        throw new Error('Invalid username. It must be 3-20 characters long and contain only letters, numbers, or underscores.');
    }
};


const validPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!password || !passwordRegex.test(password)) {
        throw new Error(
            'Invalid password. It must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.'
        );
    }
};
const isUserRegisterd = async (req) => {
    const userID = req.header('userId');
    if (!userID) {
        throw new Error('Missing userId header - Only an existing user can perform this action');
    }
    const user = await User.findById(userID);
    if (!user) {
        throw new Error('User not registerd');
    }
    if (!mongoose.Types.ObjectId.isValid(userID)) {
        throw new Error('Invalid id format');
    }
    return true;
};
const validMovie = async (movieData) => {
    // Define required fields and their expected types
    const requiredFields = {
        title: 'string',
        description: 'string',
        releaseYear: 'number',
        duration: 'number',
        categories: 'array',
    };

    // Check for missing or invalid fields
    const missingOrInvalidFields = Object.keys(requiredFields).filter(field => {
        const expectedType = requiredFields[field];
        const value = movieData[field];

        // Check if the field is missing, null, or empty
        if (value === undefined || value === null) {
            return true;
        }

        // Validate type
        if (expectedType === 'array') {
            return !Array.isArray(value) || value.length === 0;
        }
        return typeof value !== expectedType || (expectedType === 'string' && value.trim() === '');
    });

    if (missingOrInvalidFields.length > 0) {
        throw new Error(`Validation Error: Missing or invalid fields - ${missingOrInvalidFields.join(", ")}`);
    }

    // Validate movie title uniqueness
    const existingMovie = await Movie.findOne({ title: movieData.title });
    if (existingMovie) {
        throw new Error("Movie title must be unique");
    }

    // Validate each category ID
    for (const categoryId of movieData.categories) {
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            throw new Error(`Invalid category ID: ${categoryId}`);
        }
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            throw new Error(`Category not found: ${categoryId}`);
        }
    }
};
const isMovieExist = async (movieId) => {
    const movie= await Movie.findById(movieId);
    if(!movie){
        throw new Error ("Movie not found");
    }
};




module.exports = {
    validId,
    validStringLength,
    validUnique,
    validRequired,
    validEmail,
    validPhone,
    validUsername,
    validPassword,
    isUserRegisterd,
    validMovie,
    isMovieExist
};