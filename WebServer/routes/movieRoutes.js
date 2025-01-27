const express = require("express");
const multer = require("multer");
const path = require("path");
const movieController = require("../controllers/movieController");
const recommendationController = require("../controllers/recommendationController");

const router = express.Router();

// הגדרת Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "availableMovies/"); // תיקיית יעד
  },
  filename: (req, file, cb) => {
    const sanitizedFilename = `${Date.now()}-${file.originalname.replace(
      /\s+/g,
      "-"
    )}`; // ניקוי רווחים
    cb(null, sanitizedFilename); // שם קובץ בלבד
  },
});

const upload = multer({ storage });

// Route להעלאת סרטים
router.post(
  "/",
  upload.single("movieFile"),
  (req, res, next) => {
    req.body.movieFile = req.file ? req.file.filename : null; // שם קובץ בלבד
    next();
  },
  movieController.create
);


router.get("/search/:query", movieController.search);

router.get("/", movieController.getAll);
router.get("/:id", movieController.getById);

router.put("/:id", movieController.update);
router.delete("/:id", movieController.delete);

// ראוטים להמלצות
router.get("/:id/recommend/", recommendationController.getRecommendations);
router.post("/:id/recommend/", recommendationController.addToWatchList);
router.delete("/:id/recommend", recommendationController.deleteFromWatchList);

module.exports = router;
