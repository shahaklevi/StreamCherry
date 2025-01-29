const net = require("net");
const movieService = require("../services/movieService");
const recommendationRepository = require("../repositories/recommendationRepository");
const validator = require("../utils/validator");
const mongoose = require("mongoose");
const userRepository=require("../repositories/userRepository");
class RecommendationService {
  constructor() {
    this.host = process.env.RECOMMENDATION_IP;
    this.port = process.env.RECOMMENDATION_PORT;
  }

  // Opens a socket connection
  openConnection() {
    return new Promise((resolve, reject) => {
      const client = new net.Socket();
      client.connect(this.port, this.host, () => {
        resolve(client);
      });

      client.on("error", (err) => {
        reject(err);
      });
    });
  }
  // Sends a command to the server and closes the connection after execution
  async sendCommand(command) {
    const client = await this.openConnection();
    return new Promise((resolve, reject) => {
      client.write(command);

      // Listen for server response
      client.once("data", (data) => {
        client.destroy(); // Close the connection
        resolve(data.toString());
      });

      // Handle connection errors
      client.once("error", (err) => {
        client.destroy(); // Close the connection
        reject(err);
      });
    });
  }

  async getRecommendations(userId, movieId) {
    try {
      // Validate the user ID
      if (validator.validId(userId)) {
        throw new Error(`Invalid userId: ${userId}`);
      }

      // Send the command to fetch recommendations
      const command = `GET ${userId} ${movieId}`;
      const response = await this.sendCommand(command);

      // Clean and split the response into movie IDs
      const cleanedResponse = response.trim().replace(/\s+/g, " ");
      const rawMovieIds = cleanedResponse.split(" ");


      
      // Validate and filter valid movie IDs
      const validMovieIds = rawMovieIds.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );

      

      // Fetch recommendations by valid movie IDs
      const recommendations = await Promise.all(
        validMovieIds.map(async (id) => {
          const movie = await recommendationRepository.getMovieById(id);
          return movie ? movie.toJSON() : null; // Convert to JSON and skip nulls
        })
      );

      // Filter out any null results (in case a movie ID was valid but not found)
      return recommendations.filter((movie) => movie !== null);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      return []; // Return an empty array in case of failure
    }
  }

  async addToWatchList(userId, movieId) {
    // Validate user ID passed within the header
    validator.validId(userId);
    const user= await userRepository.getUser(userId);
    if(user.watchList.includes(movieId)){
      throw new Error ("The user already watched this movie");
    }
    const command = `POST ${userId} ${movieId}`;
    const response = await this.sendCommand(command);
    if (response === "404 Not Found") {
     
      await this.updateWatchList(userId, movieId);
    } else {
      recommendationRepository.addToWatchList(userId, movieId);
     
    }
  }
  async updateWatchList(userId, movieId) {
    const command = `PATCH ${userId} ${movieId}`;
    const response = await this.sendCommand(command);
    recommendationRepository.addToWatchList(userId, movieId);
    
  }

  async deleteFromWatchList(userId, movieId) {
    // Validate user ID passed within the header
    validator.validId(userId);
    const command = `DELETE ${userId} ${movieId}`;
    const response = await this.sendCommand(command);
  }
}
module.exports = new RecommendationService();
