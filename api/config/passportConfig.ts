// /api/config/passportConfig.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { findOrCreateUser } from '../services/UserService'; // Define this to handle user lookup/creation.

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      const user = await findOrCreateUser(profile);
      cb(null, user);
    } catch (error) {
      cb(error, null);
    }
  }
));
