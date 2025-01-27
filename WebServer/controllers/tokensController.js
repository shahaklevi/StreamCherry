const tokensService = require('../services/tokensService')
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const generateToken = (user) => {
    if (!secret) {
      throw new Error('JWT secret is not defined');
    }
  
    return jwt.sign(
      {
        _id: user._id,
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
  const token = req.body.token; // Extract the token from the request body

  if (typeof token !== 'string') {
    return res.status(400).json({ error: 'Invalid token format' }); // Validate token format
  }

  try {
    // Decode and verify the existing token
    const userData = verifyToken(token);

    // Generate a new token based on the decoded user data
    const newToken = generateToken(userData);

    // Send the user data and the new token back to the client
    res.json({ user: userData, token: newToken });
  } catch (error) {
    console.error("Error verifying token:", error); // Log the error for debugging
    res.status(401).json({ error: 'Invalid token' }); // Send a 401 Unauthorized response
  }
};

module.exports ={autentication,generateToken,verifyUserToken,verifyToken};