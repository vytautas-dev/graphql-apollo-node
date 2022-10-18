import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { applyMiddleware } from "graphql-middleware";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import express from "express";
import http from "http";
import cors from "cors";
import session from "express-session";
import "dotenv/config";
import mongoose from "mongoose";
import { typeDefs } from "./typedefs/typeDefs";
import resolvers from "./resolvers/resolvers";
import { json } from "body-parser";
import permissions from "./helpers/permissions";
import cookieParser from "cookie-parser";

//config variables
const port = process.env.PORT;
const host = process.env.HOST;
const dbUri = process.env.DB_URI;
const sessionSecret = process.env.SESSION_SECRET;

//connect to DB
mongoose
  .connect(dbUri)
  .then(() => {
    console.log("DB connected");
    startApolloServer();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const startApolloServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema: applyMiddleware(
      makeExecutableSchema({
        typeDefs,
        resolvers,
      }),
      permissions
    ),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  const corsOptions = {
    origin: "https://studio.apollographql.com",
    credentials: true,
  };

  app.use(
    "/",
    cors<cors.CorsRequest>(corsOptions),
    json(),
    cookieParser(),
    session({
      name: "mySession",
      secret: sessionSecret,
      resave: true,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      },
    }),
    expressMiddleware(server, {
      context: async ({ req }: any) => ({
        req,
      }),
    })
  );

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server ready at ${host}:${port}`);
};
