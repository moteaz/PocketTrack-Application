// controllers/authController.js

// Importing pool from config/db
const pool = require('../config/db');  // No need to redeclare the pool using 'new Pool()'
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Function to hash the password (assuming it's defined somewhere)
const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};


const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  const profilePic = req.file ? "/uploads/"+req.file.filename : null;  // Handle uploaded file
  // Hash password before storing it
  const hashedPassword = await hashPassword(password);
  // Store the user in the 'users' table with the uploaded profile picture filename
  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const result = await pool.query(
      'INSERT INTO users (fullname, email, password, profile_pic, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [fullname, email, hashedPassword , profilePic, new Date()]
    );
    const newUser = result.rows[0];
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ error: 'Failed to create user' });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, userId: user.id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
};


const getUser = async (req, res) => {
  const userId = req.userId; 
    // Extracting user ID from the JWT token payload
  
  try {
    // Query the database to get the user's details
    const result = await pool.query('SELECT id, fullname, email, profile_pic, created_at FROM users WHERE id = $1', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    res.json( user );
  } catch (error) {
    console.error('getUser error:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

const editUser = async (req, res) => {
  const userId = req.userId;
  const { fullname, email, password } = req.body;
  let profilePic = null;

  if (req.file) {
    profilePic = "/uploads/" + req.file.filename;
  }

  try {
    // Fetch existing user data
    const existingUserQuery = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const existingUser = existingUserQuery.rows[0];

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If a new email is provided, check for duplicates
    if (email && email !== existingUser.email) {
      const emailCheck = await pool.query(
        'SELECT * FROM users WHERE email = $1 AND id != $2',
        [email, userId]
      );
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Email already in use by another user' });
      }
    }

    // Build dynamic update fields
    let fields = [];
    let values = [];
    let index = 1;

    if (fullname) {
      fields.push(`fullname = $${index++}`);
      values.push(fullname);
    }
    if (email) {
      fields.push(`email = $${index++}`);
      values.push(email);
    }
    if (password) {
      const hashedPassword = await hashPassword(password);
      fields.push(`password = $${index++}`);
      values.push(hashedPassword);
    }
    if (profilePic) {
      fields.push(`profile_pic = $${index++}`);
      values.push(profilePic);
    }

    // If no fields to update
    if (fields.length === 0) {
      return res.status(400).json({ message: 'No changes provided' });
    }

    values.push(userId); // Final value is userId
    const updateQuery = `UPDATE users SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;

    const result = await pool.query(updateQuery, values);
    const updatedUser = result.rows[0];

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });

  } catch (error) {
    console.error('EditUser error:', error.message);
    res.status(500).json({ error: 'Failed to update user' });
  }
};



module.exports = {
  signup,
  login,
  getUser,
  editUser
};
