const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true },
    movies: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie'
        }],
        default: []
    },
    promoted: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Category', categorySchema);
