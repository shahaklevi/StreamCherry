const express = require("express");
const movieController = require("../controllers/movieController");
const recommendationController = require("../controllers/recommendationController");
const upload = require("../utils/upload"); // Import upload middleware

const router = express.Router();

// Route to create a movie (POST)
router.post(
  "/",
  upload.fields([
    { name: "movieImage", maxCount: 1 },
    { name: "movieFile", maxCount: 1 },
  ]),
  movieController.create
);

// Route to update a movie (PUT)
router.put(
  "/:id",
  upload.fields([
    { name: "movieImage", maxCount: 1 },
    { name: "movieFile", maxCount: 1 },
  ]),
  movieController.update
);

// Route to delete a movie (DELETE)
router.delete("/:id", movieController.delete);

// Route to search movies
router.get("/search/:query", movieController.search);

// Get all movies
router.get("/", movieController.getAll);

// Get a specific movie by ID
router.get("/:id", movieController.getById);

// Recommendation routes
router.get("/:id/recommend/", recommendationController.getRecommendations);
router.post("/:id/recommend/", recommendationController.addToWatchList);
router.delete("/:id/recommend", recommendationController.deleteFromWatchList);

module.exports = router;
