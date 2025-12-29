require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes"); // 👈 added

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes); // 👈 added

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
