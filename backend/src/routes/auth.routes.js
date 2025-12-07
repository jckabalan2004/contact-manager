const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { validateRegister, validateLogin, validate } = require("../middleware/validation.middleware");

router.post("/register", validateRegister, validate, authController.register);
router.post("/login", validateLogin, validate, authController.login);
router.post("/logout", authController.logout);

// must be GET and must not be commented
router.get("/me", authController.me);

// optional refresh token
router.post("/refresh-token", authController.refreshToken);

module.exports = router;
