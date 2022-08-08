const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");

router.post("/logins", userController.login);
router.post("/register", userController.createUser);

module.exports = router;
