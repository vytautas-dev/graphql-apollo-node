import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import fs from "fs";
import path from "path";
import passport from "passport";
import "dotenv/config";
import User from "../models/User";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: "http://localhost:5000/auth/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      const payload = {
        type: "authorized_user",
        client_id: googleClientId,
        client_secret: googleClientSecret,
        refresh_token: refreshToken,
      };
      const data = JSON.stringify(payload);

      const TOKEN_PATH = path.join(process.cwd(), "token.json");
      await fs.writeFile(TOKEN_PATH, data, function (err) {
        if (err) throw err;
        console.log("Saved!");
      });
      try {
        const user = await User.findOneAndUpdate(
          { email: profile.emails![0].value },
          { refreshToken }
        );
        if (user) {
          return done(null, user);
        } else {
          const newUser = new User({
            username: profile.displayName,
            email: profile.emails![0].value,
            password: "password123",
            refreshToken: refreshToken,
          });
          const savedUser = await newUser.save();
          done(null, savedUser);
        }
      } catch (error: any) {
        done(error);
      }
    }
  )
);

//what kind of data of the user should be stored in the session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

//retrieve the data of the user with the data stored in session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
