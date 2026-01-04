const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            phone,
            emergencyName,
            emergencyPhone,
        } = req.body;

        // 1️⃣ Email exists check
        const emailCheck = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (emailCheck.rows.length > 0) {
            return res.status(409).json({
                message: "An account with this email already exists",
            });
        }

        // 2️⃣ Phone exists check
        if (phone) {
            const phoneCheck = await pool.query(
                "SELECT id FROM users WHERE phone = $1",
                [phone]
            );

            if (phoneCheck.rows.length > 0) {
                return res.status(409).json({
                    message: "An account with this phone number already exists",
                });
            }
        }

        // 3️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4️⃣ Insert user
        await pool.query(
            `INSERT INTO users 
       (full_name, email, password, phone, emergency_contact_name, emergency_contact_phone)
       VALUES ($1,$2,$3,$4,$5,$6)`,
            [fullName, email, hashedPassword, phone, emergencyName, emergencyPhone]
        );

        // 5️⃣ Success response
        return res.status(201).json({
            message: "User registered successfully",
        });

    } catch (err) {
        console.error("REGISTER ERROR:", err.message);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userResult = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        if (userResult.rows.length === 0)
            return res.status(401).json({ message: "Invalid credentials" });

        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error(" LOGIN ERROR DETAILS:", err);
        res.status(500).json({ error: "Login failed" });
    }
};
