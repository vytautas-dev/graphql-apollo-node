import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import "dotenv/config";
import User from "../models/User";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

//what kind of data of the user should be stored in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//retrieve the data of the user with the data stored in session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: "http://localhost:5000/auth/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          return done(null, user);
        } else {
          const newUser = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            password: "password123",
            refreshToken: refreshToken,
          });
          const savedUser = await newUser.save();
          done(null, savedUser);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);
