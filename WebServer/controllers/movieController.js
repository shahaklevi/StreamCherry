const movieService = require("../services/movieService");
const User = require("../models/User");
const validator = require("../utils/validator");
const path = require("path");
const fs = require("fs");
const Movie = require("../models/Movie");

class movieController {
  async getAll(req, res) {
    try {
      // await validator.isUserRegisterd(req);
      // const userId = req.headers.userid; // Getting userId from headers

      const movies = await movieService.getAll(userId); // Passing userId to service
      res.json({ movies });
    } catch (error) {
      if (
        error.message ==
        "Missing userId header - Only an existing user can perform this action"
      ) {
        res.status(400).send(error.message);
      } else if (
        error.message == "User not registerd" ||
        error.message.includes("Cast to ObjectId failed for value")
      ) {
        res.status(404).send("User not registerd");
      } else {
        res.status(500).send(error.message);
      }
    }
  }

  async getById(req, res) {
    try {
      // await validator.isUserRegisterd(req);
      const movie = await movieService.getById(req.params.id);
      res.json(movie);
    } catch (error) {
      if (
        error.message === "Id is required" ||
        error.message === "Invalid id format"
      ) {
        res.status(400).json({ error: error.message });
      } else if (
        error.message ==
        "Missing userId header - Only an existing user can perform this action"
      ) {
        res.status(400).send(error.message);
      } else if (
        error.message == "User not registerd" ||
        error.message.includes("Cast to ObjectId failed for value")
      ) {
        res.status(404).send("User not registerd");
      } else {
        res.status(404).json({ error: error.message });
      }
    }
  }

  async create(req, res) {
    // Define temp files
    const tempFiles = {
      movieImage: req.files?.movieImage?.[0]?.path || "",
      movieFile: req.files?.movieFile?.[0]?.path || "",
    };

    try {
      // await validator.isUserRegisterd(req);
      await validator.validMovie(req.body);
      const movie = await movieService.create({
        title: req.body.title,
        description: req.body.description,
        releaseYear: req.body.releaseYear,
        duration: req.body.duration,
        categories: req.body.categories,
        movieFile: tempFiles.movieFile,
        movieImage: tempFiles.movieImage,
        cast: req.body.cast,
        director: req.body.director,
      });

      // Move uploaded files to their final destinations
      if (tempFiles.movieImage) {
        const ext = path.extname(tempFiles.movieImage);
        const finalPath = `uploads/movieImages/${movie._id}${ext}`;
        fs.copyFileSync(tempFiles.movieImage, finalPath);
        fs.unlinkSync(tempFiles.movieImage);
        movie.movieImage = finalPath;
      }

      if (tempFiles.movieFile) {
        const finalPath = `uploads/movies/${movie._id}.mp4`;
        fs.copyFileSync(tempFiles.movieFile, finalPath);
        fs.unlinkSync(tempFiles.movieFile);
        movie.movieFile = finalPath;
      }

      // Save updated movie with final file paths
      await movie.save();
      res.status(201).json({ movie });
    } catch (error) {
      // Clean up temp files if they exist
      Object.values(tempFiles).forEach(async (file) => {
        if (file && fs.existsSync(file)) {
          await fs.promises.unlink(file);
        }
      });

      if (error.message.includes("E11000 duplicate")) {
        res.status(400).json({ error: "Movie title must be unique" });
      } else if (error.message.includes("is required")) {
        res.status(400).json({ error: error.message });
      } else if (
        error.message.includes("Invalid category ID") ||
        error.message.includes("Category not found")
      ) {
        res.status(400).json({ error: error.message });
      } else if (
        error.message ==
        "Missing userId header - Only an existing user can perform this action"
      ) {
        res.status(400).send(error.message);
      } else if (
        error.message == "User not registerd" ||
        error.message.includes("Cast to ObjectId failed for value")
      ) {
        res.status(404).send("User not registerd");
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async update(req, res) {
    // Temporary uploaded files
    const tempFiles = {
      movieImage: req.files?.movieImage?.[0]?.path || "",
      movieFile: req.files?.movieFile?.[0]?.path || "",
    };
    try {
      // Fetch existing movie before updating
      const existingMovie = await Movie.findById(req.params.id);
      if (!existingMovie) {
        return res.status(404).json({ error: "Movie not found" });
      }

      // Store original file paths before update
      const originalPaths = {
        movieImage: existingMovie.movieImage,
        movieFile: existingMovie.movieFile,
      };

      // // Update movie details in DB
      // await validator.validMovie(req.body);
      await movieService.update(req.params.id, req.body);

      // ✅ Handle file replacement logic
      if (tempFiles.movieImage) {
        const newImagePath = `uploads/movieImages/${
          existingMovie._id
        }${path.extname(tempFiles.movieImage)}`;

        // Delete old movie image if it exists
        if (
          originalPaths.movieImage &&
          fs.existsSync(originalPaths.movieImage)
        ) {
          fs.unlinkSync(originalPaths.movieImage);
        }

        // Move new image to correct location
        fs.renameSync(tempFiles.movieImage, newImagePath);
        existingMovie.movieImage = newImagePath;
      }
      if (tempFiles.movieFile) {
        const newFilePath = `uploads/movies/${existingMovie._id}.mp4`;

        // Delete old movie file if it exists
        if (originalPaths.movieFile && fs.existsSync(originalPaths.movieFile)) {
          fs.unlinkSync(originalPaths.movieFile);
        }

        // Move new file to correct location
        fs.renameSync(tempFiles.movieFile, newFilePath);
        existingMovie.movieFile = newFilePath;
      }

      // ✅ Save updated movie with new file paths
      await existingMovie.save();
      res.status(204).send();
    } catch (error) {
      // Clean up temp files if they exist
      Object.values(tempFiles).forEach(async (file) => {
        if (file && fs.existsSync(file)) {
          await fs.promises.unlink(file);
        }
      });
      if (
        error.message ==
        "Missing userId header - Only an existing user can perform this action"
      ) {
        res.status(400).send(error.message);
      } else if (
        error.message == "User not registerd" ||
        error.message.includes("Cast to ObjectId failed for value")
      ) {
        res.status(404).send("User not registerd");
      } else {
        res.status(404).json({ error: error.message });
      }
    }
  }

  async delete(req, res) {
    try {
      // Fetch the movie details before deleting
      const existingMovie = await Movie.findById(req.params.id);
      console.log(existingMovie);
      if (!existingMovie) {
        return res.status(404).json({ error: "Movie not found" });
      }

      // Extract file paths
      const filePaths = {
        movieImage: existingMovie.movieImage,
        movieFile: existingMovie.movieFile,
      };

      console.log(filePaths.movieImage + " " + filePaths.movieFile);

      // Delete movie from DB
      await movieService.delete(req.params.id);

      // ✅ Delete associated files (movieImage & movieFile)
      if (filePaths.movieImage && fs.existsSync(filePaths.movieImage)) {
        fs.unlinkSync(filePaths.movieImage);
        console.log(`Deleted movie image: ${filePaths.movieImage}`);
      }

      if (filePaths.movieFile && fs.existsSync(filePaths.movieFile)) {
        fs.unlinkSync(filePaths.movieFile);
        console.log(`Deleted movie file: ${filePaths.movieFile}`);
      }

      res.status(204).send();
    } catch (error) {
      // res.status(500).send(error.message);
      if (
        error.message ==
        "Missing userId header - Only an existing user can perform this action"
      ) {
        res.status(400).send(error.message);
      } else if (
        error.message == "User not registerd" ||
        error.message.includes("Cast to ObjectId failed for value")
      ) {
        res.status(404).send("User not registerd");
      } else {
        res.status(404).json({ error: error.message });
      }
    }
  }

  async search(req, res) {
    try {
      // await validator.isUserRegisterd(req);
      const query = req.params.query;
      const movies = await movieService.search(query);
      res.json({ movies });
    } catch (error) {
      // res.status(500).send(error.message);
      if (
        error.message ==
        "Missing userId header - Only an existing user can perform this action"
      ) {
        res.status(400).send(error.message);
      } else if (
        error.message == "User not registerd" ||
        error.message.includes("Cast to ObjectId failed for value")
      ) {
        res.status(404).send("User not registerd");
      } else {
        res.status(404).send("No movies found");
      }
      res.status(500).send(error.message);
    }
  }
}
module.exports = new movieController();
