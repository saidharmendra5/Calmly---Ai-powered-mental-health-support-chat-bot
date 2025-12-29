const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const { getMe } = require("../controllers/user.controller");

const router = express.Router();

router.get("/me", authMiddleware, getMe);

module.exports = router;
