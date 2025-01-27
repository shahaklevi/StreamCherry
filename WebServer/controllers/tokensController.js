const tokensService = require('../services/tokensService')
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const generateToken = (user) => {
    if (!secret) {
      throw new Error('JWT secret is not defined');
    }
  
    return jwt.sign(
      {
        user_name: user.user_name, 
        mail: user.mail,           
        phone: user.phone,         
        picture: user.picture,
        manager: user.manager
      },
      secret,
      { expiresIn: '24h' } 
    );
  };
  
const autentication = async (req,res) => {
    try{
      user=await tokensService.autentication(req.body.user_name,req.body.password);
        if (user) {
          const token = generateToken(user);
          res.status(200).json({ user, token });
        } else {
          res.status(401).json({ error: 'Invalid username or password' });
        }
    }catch(error){
        if (error.message.includes('User Name and Password must not be empty')) {
            res.status(400).json({ error: 'User Name and Password must not be empty' });
        }
        else {
            res.status(404).json({ error: 'Incorrect username or password' });
        }
    }
}
const verifyToken = (token) => {
    if (!secret) {
      throw new Error('JWT secret is not defined');
    }
    return jwt.verify(token, secret);
  };
  
// Controller method to handle token verification
const verifyUserToken = (req, res) => {
    const token = req.body.token;
    
    if (typeof token !== 'string') {
      return res.status(400).json({ error: 'Invalid token format' });
    }
  
    try {
      const userData = verifyToken(token);
      res.json(userData);
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
module.exports ={autentication,generateToken,verifyUserToken,verifyToken};