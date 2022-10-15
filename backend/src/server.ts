import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import typeDefs from "./typedefs/typeDefs";
import resolvers from "./resolvers/resolvers";
import Auth from "./utils/verifyToken";

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
    typeDefs,
    resolvers,
    context: Auth,
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  // app.use(verifyToken);
  app.listen(port, host, () =>
    console.log(`Server is running at http//${host}:${port}`)
  );
};
