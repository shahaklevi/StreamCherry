const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true,
        unique: true, 
    },
    description: {
        type: String,
        required: true},
        releaseYear: { type: Number, required: true },
    duration: {
        type: Number,
        required: true },
    categories: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Category',
            required: true
        }
    ],
    rating: {
        type: Number, },
    cast: { 
        type: [String] },
    image: {
        type: String },
    videoUrl: { 
        type: String },
    createdAt: { 
        type: Date, 
        default: Date.now },
    watchedBy:{
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
             }],
        default: []
    }
});

module.exports = mongoose.model('Movie', MovieSchema);