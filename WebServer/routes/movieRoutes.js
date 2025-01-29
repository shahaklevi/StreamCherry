// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const movieController = require("../controllers/movieController");
// const recommendationController = require("../controllers/recommendationController");

// const router = express.Router();

// // הגדרת Multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "availableMovies/"); // תיקיית יעד
//   },
//   filename: (req, file, cb) => {
//     const sanitizedFilename = `${Date.now()}-${file.originalname.replace(
//       /\s+/g,
//       "-"
//     )}`; // ניקוי רווחים
//     cb(null, sanitizedFilename); // שם קובץ בלבד
//   },
// });

// const upload = multer({ storage });

// // Route להעלאת סרטים
// router.post(
//   "/",

//   movieController.create
// );
// router.get("/search/:query", movieController.search);

// router.get("/", movieController.getAll);
// router.get("/:id", movieController.getById);

// router.put("/:id", upload.single("newMovieFile"), async (req, res) => {
//   console.log("Updating movie with ID:", req.params.id);

//   const { oldMovieFile } = req.body;
//   const newMovieFile = req.file ? req.file.filename : null;
//   console.log("Old movie file:", oldMovieFile);
//   console.log("New movie file:", newMovieFile);

//   try {
//     const oldFilePath = path.join(
//       __dirname,
//       "../availableMovies/",
//       oldMovieFile
//     );
//     const newFilePath = path.join(
//       __dirname,
//       "../availableMovies/",
//       newMovieFile
//     );

//     // delete the old movie file if it exists
//     if (fs.existsSync(oldFilePath)) {
//       fs.unlinkSync(oldFilePath);
//       console.log(`File ${oldMovieFile} deleted successfully`);
//     } else {
//       console.log(`File ${oldMovieFile} does not exist, skipping deletion.`);
//     }

//     // add the new movie file
//     // Assuming multer middleware has already saved the new file to the correct location

//     await movieController.update(req, res); // Update the movie details
//   } catch (error) {
//     console.error("Error while updating movie:", error.message);
//     res.status(500).json({ error: "Failed to update movie" });
//   }
// });

// router.delete("/:id", async (req, res) => {
//   console.log("Deleting movie with ID:", req.params.id);

//   const { movieFile } = req.body;
//   console.log("Deleting movie file:", movieFile);

//   try {
//     const filePath = path.join(__dirname, "../availableMovies/", movieFile);

//     // delete the movie file if it exists
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//       console.log(`File ${movieFile} deleted successfully`);
//     } else {
//       console.log(`File ${movieFile} does not exist, skipping deletion.`);
//     }

//     await movieController.delete(req, res); // תן לבקר לשלוט ב-`res`
//   } catch (error) {
//     console.error("Error while deleting movie:", error.message);
//     res.status(500).json({ error: "Failed to delete movie" });
//   }
// });

// // ראוטים להמלצות
// router.get("/:id/recommend/", recommendationController.getRecommendations);
// router.post("/:id/recommend/", recommendationController.addToWatchList);
// router.delete("/:id/recommend", recommendationController.deleteFromWatchList);

// module.exports = router;
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
