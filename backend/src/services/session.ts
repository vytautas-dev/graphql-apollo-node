import session from "express-session";
import MongoStore from "connect-mongo";
import "dotenv/config";

const dbUri = process.env.DB_URI;
const sessionSecret = process.env.SESSION_SECRET;

export const expressSession = session({
  name: "mySession",
  secret: sessionSecret,
  store: MongoStore.create({
    mongoUrl: dbUri,
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  },
});
