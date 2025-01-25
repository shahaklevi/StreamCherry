const tokensRepository = require('../repositories/tokensRepository');

const autentication = async (user_name,password) => {
    if(!user_name || user_name.length ==0  || !password || password.length==0){
        throw new Error(`User Name and Password must not be empty`);
    }
    const user= await tokensRepository.autentication(user_name,password)
    if (!user){
        throw new Error(`User not found`);
    }
    return user;
};
module.exports ={autentication}
