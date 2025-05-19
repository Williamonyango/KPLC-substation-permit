const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.getUsers = async (req, res) => {
  const { email, id_number } = req.query;
  try {
    const connection = await pool.getConnection();
    let query = "SELECT * FROM users";
    const values = [];

    if (email && id_number) {
      query += " WHERE Email = ? AND Id_number = ?";
      values.push(email, id_number);
    }

    const [rows] = await connection.query(query, values);
    connection.release();

    const usersWithTokens = rows.map((user) => {
      const token = jwt.sign(
        { id: user.id, email: user.Email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return { ...user, token };
    });

    res.status(200).json(usersWithTokens);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.createUser = async (req, res) => {
  const { Name, Email, Id_number } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const connection = await pool.getConnection();
    const [existing] = await connection.query(
      "SELECT * FROM users WHERE Email = ?",
      [Email]
    );

    if (existing.length > 0) {
      connection.release();
      return res.status(409).json({ error: "Email already exists." });
    }

    await connection.query(
      "INSERT INTO users (Name, Email, Id_number) VALUES (?, ?, ?)",
      [Name, Email, Id_number]
    );

    const [newUser] = await connection.query(
      "SELECT * FROM users WHERE Email = ?",
      [Email]
    );
    connection.release();

    const token = jwt.sign(
      { id: newUser[0].id, email: newUser[0].Email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ user: newUser[0], token });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};
