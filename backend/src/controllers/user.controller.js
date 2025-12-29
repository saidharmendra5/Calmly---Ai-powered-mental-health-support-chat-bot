const pool = require("../db");

exports.getMe = async (req, res) => {
    const userId = req.user.id;

    const result = await pool.query(
        `SELECT id, full_name, email, phone,
            emergency_contact_name,
            emergency_contact_phone,
            created_at
     FROM users
     WHERE id = $1`,
        [userId]
    );

    res.json(result.rows[0]);
};
