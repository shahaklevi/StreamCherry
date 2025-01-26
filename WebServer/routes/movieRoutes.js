const express = require("express");
const multer = require("multer");
const path = require("path");
const movieController = require("../controllers/movieController");
const recommendationController = require("../controllers/recommendationController");

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "availableMovies/"); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); 
  },
});

const upload = multer({ storage });

router.get("/search/:query", movieController.search);

router.get("/", movieController.getAll);
router.get("/:id", movieController.getById);


router.post(
  "/",
  upload.single("movieFile"), 
  (req, res, next) => {
    req.body.movieFile = req.file ? req.file.path : null; 
    next();
  },
  movieController.create
);

router.put("/:id", movieController.update);
router.delete("/:id", movieController.delete);

// ראוטים להמלצות
router.get("/:id/recommend/", recommendationController.getRecommendations);
router.post("/:id/recommend/", recommendationController.addToWatchList);
router.delete("/:id/recommend", recommendationController.deleteFromWatchList);

module.exports = router;
