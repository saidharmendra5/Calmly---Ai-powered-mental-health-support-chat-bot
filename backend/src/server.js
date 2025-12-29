require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const chatRoutes = require("./routes/chat.routes"); // 👈 1. Added Chat Routes import

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes); // 👈 2. Added Chat API endpoint

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});