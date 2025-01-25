const User = require('../models/User');

const autentication = async (user_name,password) => {
    const user = await User.findOne({ user_name : user_name, password : password });

    if (user) {
     return { userId : user.id };
    }
};
module.exports ={autentication}
