const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create directories if they don't exist
const directories = [
  "uploads/temp",
  "uploads/usersImages",
  "uploads/movies",
  "uploads/movieImages",
];

directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Store files temporarily first
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/temp");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 1024 }, // Increased to 100MB for videos
    fileFilter: (req, file, cb) => {
        console.log("from fileFilter",file);
        if (file.fieldname === 'profilePicture' || 
            file.fieldname === 'movieImage') {

            console.log("from picture",file);
            // Image files
            const imageTypes = /jpeg|jpg|png|gif/;
            const extname = imageTypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = imageTypes.test(file.mimetype);
            
            if (extname && mimetype) {
                return cb(null, true);
            }
            cb(new Error('Only image files are allowed'));
        } else if ( file.fieldname === 'movieFile') {
            // Video files
            console.log("from movie",file);
            const videoTypes = /mp4|avi|mov/;
            const extname = videoTypes.test(path.extname(file.originalname).toLowerCase());
            
            if (extname) {
                return cb(null, true);
            }
            cb(new Error('Only video files are allowed'));
        }
    }
});

module.exports = upload;
