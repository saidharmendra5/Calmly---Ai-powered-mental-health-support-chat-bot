// src/routes/chat.routes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware"); // Reuse your existing middleware
const chatController = require("../controllers/chat.controller"); // The controller we created earlier

// All these routes are protected by authMiddleware
router.use(authMiddleware);

router.get("/", chatController.getAllChats);           // GET /api/chats
router.get("/:chatId", chatController.getChatHistory); // GET /api/chats/:id
router.post("/", chatController.createChat);           // POST /api/chats (New Chat)
router.post("/:chatId/message", chatController.sendMessage); // POST /api/chats/:id/message

module.exports = router;