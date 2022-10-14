import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import mongoose from "mongoose";
import typeDefs from "./typedefs/typeDefs";
import resolvers from "./resolvers/resolvers";

//config variables
const port = process.env.PORT;
const host = process.env.HOST;
const dbUri = process.env.DB_URI;
const nodeEnv = process.env.NODE_ENV;
const jwtSecret = process.env.JWT_SECRET;

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
  //cors configuration
  app.use(cors());

  //body parser middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  //apollo server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app });

  // app.use(verifyToken);
  app.listen(port, host, () =>
    console.log(`Server is running at http//${host}:${port}`)
  );
};
