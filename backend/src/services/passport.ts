import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import "dotenv/config";
import Settings from "../models/Settings";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_OAUTH_REDIRECT_URL;

//what kind of data of the user should be stored in the session: req.session.passport.user = {}
passport.serializeUser(function (profile: any, done) {
  done(null, profile.id);
});
//retrieve the data of the user with the data stored in session
passport.deserializeUser(function (id: string, done) {
  done(null, id);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      console.log(profile);
      await Settings.collection.drop();
      await new Settings({ refreshToken }).save();
      done(null, profile);
    }
  )
);
