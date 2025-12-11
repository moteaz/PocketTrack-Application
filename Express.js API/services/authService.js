const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { SALT_ROUNDS, TOKEN_EXPIRY, HTTP_STATUS } = require('../utils/constants');
const ApiError = require('../utils/responses/ApiError');

class AuthService {
  async hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  }

  async findUserByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  async findUserById(userId) {
    const result = await pool.query(
      'SELECT id, fullname, email, profile_pic, created_at FROM users WHERE id = $1',
      [userId]
    );
    return result.rows[0];
  }

  async createUser(fullname, email, password, profilePic) {
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new ApiError('User already exists', HTTP_STATUS.CONFLICT);
    }

    const hashedPassword = await this.hashPassword(password);
    const result = await pool.query(
      'INSERT INTO users (fullname, email, password, profile_pic, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, fullname, email, profile_pic, created_at',
      [fullname, email, hashedPassword, profilePic, new Date()]
    );
    return result.rows[0];
  }

  async authenticateUser(email, password) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new ApiError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
    }

    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
    }

    const token = this.generateToken(user.id);
    return { token, userId: user.id };
  }

  async updateUser(userId, updates) {
    const existingUser = await this.findUserById(userId);
    if (!existingUser) {
      throw new ApiError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    // Check email uniqueness if email is being updated
    if (updates.email && updates.email !== existingUser.email) {
      const emailCheck = await pool.query(
        'SELECT * FROM users WHERE email = $1 AND id != $2',
        [updates.email, userId]
      );
      if (emailCheck.rows.length > 0) {
        throw new ApiError('Email already in use by another user', HTTP_STATUS.CONFLICT);
      }
    }

    // Build dynamic update query
    const fields = [];
    const values = [];
    let index = 1;

    if (updates.fullname) {
      fields.push(`fullname = $${index++}`);
      values.push(updates.fullname);
    }
    if (updates.email) {
      fields.push(`email = $${index++}`);
      values.push(updates.email);
    }
    if (updates.password) {
      const hashedPassword = await this.hashPassword(updates.password);
      fields.push(`password = $${index++}`);
      values.push(hashedPassword);
    }
    if (updates.profilePic) {
      fields.push(`profile_pic = $${index++}`);
      values.push(updates.profilePic);
    }

    if (fields.length === 0) {
      throw new ApiError('No changes provided', HTTP_STATUS.BAD_REQUEST);
    }

    values.push(userId);
    const updateQuery = `UPDATE users SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, fullname, email, profile_pic, created_at`;

    const result = await pool.query(updateQuery, values);
    return result.rows[0];
  }
}

module.exports = new AuthService();
