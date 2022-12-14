import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import "dotenv/config";
import Settings from "../models/Settings";
import User from "../models/User";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleCallbackURL = process.env.GOOGLE_OAUTH_REDIRECT_URL;

//what kind of data of the user should be stored in the session: req.session.passport.user = {}
passport.serializeUser(function (user: any, done) {
  console.log("Serializing user:", user);
  return done(null, user.id);
});

//you can use the first argument to find a user in db and attached it to the req.user
passport.deserializeUser(function (id: string, done) {
  console.log("Deserializing user by his id:", id);
  User.findById(id, (err: any, user: any) => done(err, user));
});

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: googleCallbackURL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      console.log("accessToken: ", accessToken);
      console.log("refreshToken: ", refreshToken);
      console.log("profile: ", profile);
      await Settings.collection.drop();
      await new Settings({ refreshToken }).save();

      const defaultUser = {
        username: profile.displayName,
        email: profile.emails![0].value,
        googleId: profile.id,
      };

      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        } else {
          user = await User.create(defaultUser);
          return done(null, user);
        }
      } catch (err) {
        console.error(err);
      }
    }
  )
);
