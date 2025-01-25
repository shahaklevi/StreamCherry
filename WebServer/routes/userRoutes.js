const express = require("express");
const multer = require("multer");
const path = require("path");
const userController = require("../controllers/userController");

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploadsProfilePicture/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });


router.post(
  "/",
  upload.single("picture"), // Middleware לטיפול בקובץ התמונה
  (req, res, next) => {
    req.body.picture = req.file ? req.file.path : null; // שמירת נתיב התמונה ב-body
    next();
  },
  userController.createUser
);

router.get("/:id", userController.getUser);

module.exports = router;
