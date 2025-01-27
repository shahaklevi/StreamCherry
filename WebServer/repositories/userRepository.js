const User = require('../models/User');

const createUser = async (userData) => {
    const user = new User({ 
        user_name: userData.user_name,
        nickName: userData.nickName,
        password: userData.password,
        mail: userData.mail,
        phone: userData.phone,
        picture: userData.picture,
        watchList: [], // Explicitly set watchList to an empty array
        manager: userData.manager,
    });
    return await user.save();
};

const getUser = async (id) => {
    return await User.findById(id);
 };
 const updateUserWatchlist = async (userId, movieId) => {
    const user = await User.findById(userId);
    if (!user.watchList.includes(movieId)) {
        user.watchList.push(movieId);
        await user.save();
    }
 };


module.exports = {createUser,getUser,updateUserWatchlist}
