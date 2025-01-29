const express = require("express");
const userController = require("../controllers/userController");
const upload = require("../utils/upload"); // Import upload middleware

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
  ]),
  userController.createUser
);

router.get("/:id", userController.getUser);



module.exports = router;
