const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema({
user_name : {
type: String,
required: true, 
unique: true,
},
password: {
    type: String,
    required: true
},
mail: {
    type: String,
    required: true, 
    unique: true,
},
phone: {
    type: String,
    required: true, 
    unique: true,
},
picture:{
    required: false, 
    type: String //url address
},
watchList: {
    required: false,
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie'
        }],
        default: []
    }
});

module.exports = mongoose.model('User', User);