const userService = require("../services/userService");
const jwt = require("jsonwebtoken");
const tokensController = require("./tokensController");

const path = require("path");
const fs = require("fs");

const validator=require("../utils/validator");



const createUser = async (req, res) => {
  const tempFiles = {
    profilePicture: req.files?.profilePicture?.[0]?.path || "",
  };

  try {
    const userData = {
      user_name: req.body.user_name,
      nickName: req.body.nickName,
      password: req.body.password,
      mail: req.body.mail,
      phone: req.body.phone,
      profilePicture: tempFiles.profilePicture,
      manager: req.body.manager,
    };
    const { user, token } = await userService.createUser(userData);

    if (tempFiles.profilePicture) {
      const ext = path.extname(tempFiles.profilePicture);
      const finalPath = `uploads/usersImages/${user._id}${ext}`;
      console.log("Final Pathhh:", finalPath);

      fs.copyFileSync(tempFiles.profilePicture, finalPath);
      fs.unlinkSync(tempFiles.profilePicture);

      // Update and save the user
      user.profilePicture = finalPath;
      await user.save(); // Ensure changes are saved in MongoDB
    }

    res.status(201).json({ user, token });
  } catch (error) {
    if (
      error.message.includes(
        "E11000 duplicate key error collection: netflix_db.users index: user_name"
      )
    ) {
      res.status(400).json({ error: "The user name is already in use" });
    } else if (
      error.message.includes(
        "E11000 duplicate key error collection: netflix_db.users index: mail"
      )
    ) {
      res.status(400).json({ error: "The E-mail is already in use" });
    } else if (
      error.message.includes(
        "E11000 duplicate key error collection: netflix_db.users index: phone"
      )
    ) {
      res.status(400).json({ error: "The Phone number is already in use" });
    } else if (error.message.includes("Unexpected token ")) {
      res.status(400).json({
        error:
          "One of the following fileds are missing: user_name,password,mail,phone",
      });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};
const getUser = async (req, res) => {
    try {
        validator.isValidJWT(req);
        const user = await userService.getUser(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        if (error.message.includes('User not found')) {
            res.status(404).json({ error: error.message });
        }
        else if (error.message.includes('[object Object')) {
            res.status(404).json({ error: 'User not found' });
        }
        else if (error.message.includes('Cast to ObjectId failed for value')) {
            res.status(404).json({ error: 'User not found' });
        }
        else {
            res.status(400).json({ error: error.message });
        }
    }
};

const updateUserWatchlist = async (req, res) => {
  try {
    const userId = req.params.id;
    const movieId = req.params.movieId;

    const updatedUser = await userService.updateUserWatchlist(userId, movieId);
    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.message.includes("User not found")) {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes("Movie not found")) {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes("Invalid movie ID")) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = { createUser, getUser, updateUserWatchlist };
