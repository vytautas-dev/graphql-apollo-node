import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { schema, setHttpPlugin } from "./config";
import { expressMiddleware } from "@apollo/server/express4";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServer } from "@apollo/server";
import express, { Request, Response, NextFunction } from "express";
import http from "http";
import cors from "cors";
import session from "express-session";
import "dotenv/config";
import mongoose from "mongoose";
import { json } from "body-parser";

import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import "./services/passport";
import passport from "passport";
import authRoutes from "./routes/auth";
import { google } from "googleapis";
import User from "./models/User";

//config variables
const port = process.env.PORT;
const host = process.env.HOST;
const dbUri = process.env.DB_URI;
const sessionSecret = process.env.SESSION_SECRET;

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_OAUTH_REDIRECT_URL
);

//connect to DB
mongoose
  .connect(dbUri)
  .then(() => {
    console.log("DB connected!");
    startApolloServer();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const startApolloServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      setHttpPlugin,

      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await server.start();

  app.use(
    session({
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
        secure: true,
        sameSite: "none",
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const corsOptions = {
    origin: "https://studio.apollographql.com",
    credentials: true,
  };
  app.use(
    "/graphql",
    // isLoggedIn,
    (req, res, next) => {
      // console.log(req.user);
      next();
    },
    cors<cors.CorsRequest>(corsOptions),
    json(),
    cookieParser(),
    expressMiddleware(server, {
      context: async ({ req }: any) => ({
        req,
        reqUser: req.user,
      }),
    })
  );

  //Google Auth
  app.get("/", (req, res) => {
    res.send('<a href="/auth/google">Auth with Google</a>');
  });

  app.use("/auth", authRoutes);

  // app.get("/calendar", isLoggedIn, async (req: any, res: any) => {
  //   // const user = await User.findOne({id: req.session.passport.user})
  //
  //   const user = await User.findOne({ _id: req.session.passport.user });
  //   const refreshToken = user!.refreshToken;
  //
  //   // console.log("user", user);
  //   // console.log("token", refreshToken);
  //
  //   oauth2Client.setCredentials({ refresh_token: refreshToken });
  //   const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  //
  //   const response = await calendar.events.list({
  //     calendarId: "primary",
  //     timeMin: new Date().toISOString(),
  //     maxResults: 2,
  //     singleEvents: true,
  //     orderBy: "startTime",
  //   });
  //
  //   // console.log(response);
  //
  //   const events = response.data.items;
  //   console.log(events);
  // });

  //check if user is auth
  function isLoggedIn(req: Request, res: Response, next: NextFunction) {
    req.user ? next() : res.sendStatus(401);
  }

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server ready at ${host}:${port}/graphql`);
};
