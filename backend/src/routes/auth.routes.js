const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { validateRegister, validateLogin, validate } = require("../middleware/validation.middleware");

// REMOVED: const cors = require("cors");
// REMOVED: meCors middleware

router.post("/register", validateRegister, validate, authController.register);
router.post("/login", validateLogin, validate, authController.login);
router.post("/logout", authController.logout);
router.get("/me", authController.me); // No extra CORS needed
router.post("/refresh-token", authController.refreshToken);

module.exports = router;