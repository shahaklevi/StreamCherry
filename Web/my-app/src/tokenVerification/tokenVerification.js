import axios from 'axios';

const tokenVerification = async (token) => {
  try {
    const response = await axios.post('http://localhost:3000/api/tokens/verifyToken', { token }); // Make a POST request to the server with the token

    const { user, token: newToken } = response.data; // Destructure the response to get user data and the new token
    
    localStorage.setItem("jwtToken", newToken); // Save the new token in localStorage
    return user; // Return the user data for further use
  } catch (error) {
    console.error('Token verification failed:', error); // Log any errors during the process
    return null; // Return null if verification fails
  }
};

export default tokenVerification;
