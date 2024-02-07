import express from 'express';
import passport from 'passport';

const router = express.Router();

// Route to initiate Google OAuth authentication
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route after Google OAuth authentication
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

export default router;