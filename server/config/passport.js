import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find existing user
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // If no user, create one
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName || `user_${profile.id}`,
            email: profile.emails?.[0]?.value || null,
            profile: {
              avatar: profile.photos?.[0]?.value || "",
              joinDate: Date.now(),
            },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err, null));
});

export default passport;
