const recommendationService = require("../services/recommendationService");
const validator = require("../utils/validator");
class RecommendationController {
  async getRecommendations(req, res) {
    try {
      const movieId = req.params.id;
      await validator.validId(movieId);
      await validator.isMovieExist(movieId)
      // await validator.isUserRegisterd(req);
      // Retrieve the user id from the header
      const userId = req.header("userId");
      // Calling the getRecommendations method from the recommendationService with the user id and the id of the movie
      const recommendations = await recommendationService.getRecommendations(userId, movieId);
      res.json(recommendations);
    } catch (error) {
      if (error.message == 'Missing userId header - Only an existing user can perform this action') {
        res.status(400).send(error.message);
      }
      else if (error.message == 'User not registerd' || error.message.includes('Cast to ObjectId failed for value')) {
        res.status(404).send('User not registerd');
      }
      else {
        res.status(404).json({ error: error.message });
      }
      // res.status(500).send(error.message);
    }
  }

  async addToWatchList(req, res) {
    try {
      const movieId = req.params.id;
      await validator.validId(movieId);
      await validator.isMovieExist(movieId)
      // await validator.isUserRegisterd(req);
      // Retrieve the user id from the header
      const userId = req.header("userId");
      // Calling the addToWatchList method from the recommendationService with the user id and the id of the movie
      await recommendationService.addToWatchList(userId, movieId);
      res.status(204).send();
    } catch (error) {
      if (error.message == 'Missing userId header - Only an existing user can perform this action') {
        res.status(400).send(error.message);
      }
      else if (error.message == 'User not registerd' || error.message.includes('Cast to ObjectId failed for value')) {
        res.status(404).send('User not registerd');
      }
      else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async deleteFromWatchList(req, res) {
    try {
      // await validator.isUserRegisterd(req);
      // Retrieve the user id from the header
      const userId = req.header("userId");
      const movieId = req.params.id;
      if (!userId) {
        res.status(400).send("User id is required");
        return;
      }
      await recommendationService.deleteFromWatchList(userId, movieId);
      res.status(204).send();
    } catch (error) {
      if (error.message == 'Missing userId header - Only an existing user can perform this action') {
        res.status(400).send(error.message);
      }
      else if (error.message == 'User not registerd' || error.message.includes('Cast to ObjectId failed for value')) {
        res.status(404).send('User not registerd');
      }
      else {
        res.status(404).json({ error: error.message });
      }
      // res.status(500).send(error.message);
    }
  }
}

module.exports = new RecommendationController();
