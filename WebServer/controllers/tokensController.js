const tokensService = require('../services/tokensService')


const autentication = async (req,res) => {
    try{
        res.status(200).json(await tokensService.autentication(req.body.user_name,req.body.password))

    }catch(error){
        if (error.message.includes('User Name and Password must not be empty')) {
            res.status(400).json({ error: 'User Name and Password must not be empty' });
        }
        else {
            res.status(404).json({ error: 'Incorrect username or password' });
        }
    }
}
module.exports ={autentication}