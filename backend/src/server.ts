import express from "express";
import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import permissions from "./utils/permissions";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import typeDefs from "./typedefs/typeDefs";
import resolvers from "./resolvers/resolvers";
import Auth from "./utils/verifyToken";
import { applyMiddleware } from "graphql-middleware";

//config variables
const port = process.env.PORT;
const host = process.env.HOST;
const dbUri = process.env.DB_URI;

const app = express();

//connect to DB
mongoose
  .connect(dbUri)
  .then(() => {
    console.log("DB connected");
    startServer();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const startServer = async () => {
  //cors middleware
  app.use(cors());

  //body-parser middleware
  app.use(express.json());

  //apollo server
  const server = new ApolloServer({
    schema: applyMiddleware(
      makeExecutableSchema({ typeDefs, resolvers }),
      permissions
    ),
    context: Auth,
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  app.listen(port, host, () =>
    console.log(`Server is running at http//${host}:${port}`)
  );
};
