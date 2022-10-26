import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { schema, setHttpPlugin } from "./config";
import { expressMiddleware } from "@apollo/server/express4";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServer } from "@apollo/server";
import express from "express";
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

//config variables
const port = process.env.PORT;
const host = process.env.HOST;
const dbUri = process.env.DB_URI;
const sessionSecret = process.env.SESSION_SECRET;

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

  const corsOptions = {
    origin: "https://studio.apollographql.com",
    credentials: true,
  };

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
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    json(),
    cookieParser(),
    isLoggedIn,
    expressMiddleware(server, {
      context: async ({ req }: any) => ({
        req,
      }),
    })
  );

  //Google Auth
  app.get("/", (req, res) => {
    res.send('<a href="/auth/google">Auth with Google</a>');
  });

  app.use("/auth", authRoutes);

  //check if user is auth
  function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
  }

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server ready at ${host}:${port}/graphql`);
};
