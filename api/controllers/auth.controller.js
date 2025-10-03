const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const salt = bcrypt.genSaltSync(10);

const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json('Username already exists');
    }

    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });

    // Create token with sufficient unique payload
    const token = jwt.sign(
      {
        id: userDoc._id,
        username: userDoc.username,
        iat: Math.floor(Date.now() / 1000),
        rand: Math.random().toString(36).substring(2, 15),
      },
      process.env.JWT_SECRET
    );

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      })
      .json({
        id: userDoc._id,
        username: userDoc.username,
      });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json('Internal server error');
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });

  if (!userDoc) {
    return res.status(400).json('User not found');
  }

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (!passOk) {
    return res.status(400).json('Wrong credentials');
  }

  jwt.sign(
    { username, id: userDoc._id },
    process.env.JWT_SECRET,
    {},
    (err, token) => {
      if (err) return res.status(500).json('Token generation failed');

      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        })
        .json('ok');
    }
  );
};

const profile = (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, {}, (err, info) => {
    if (err) {
      return res.status(403).json({ error: 'Token verification failed' });
    }
    res.json(info);
  });
};

const logout = (req, res) => {
  res
    .cookie('token', '', {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
    .json('ok');
};

module.exports = {
  register,
  login,
  profile,
  logout,
};
