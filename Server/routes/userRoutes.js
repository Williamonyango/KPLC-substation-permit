const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getUsers);
router.post(
  "/",
  [
    body("Name").notEmpty(),
    body("Email").isEmail(),
    body("Id_number").isLength({ min: 6 }),
  ],
  userController.createUser
);

module.exports = router;
