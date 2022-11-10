//Apollo & Graphql imports
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import { schema, setHttpPlugin } from "./serverSettings/config";
import expressPlayground from "graphql-playground-middleware-express";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";

//Middlewares imports
import express from "express";
import http from "http";
import cors from "cors";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import { expressSession } from "./services/session";
import passport from "passport";
import "./services/passport";
import "dotenv/config";
import mongoose from "mongoose";

//Routes imports
import authRoutes from "./routes/auth";
import { isAuthenticated } from "./middlewares/isAuthenticated";

// env config variables
const port = process.env.PORT;
const host = process.env.HOST;
const dbUri = process.env.DB_URI;

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
    origin: ["http://localhost:3000", "https://studio.apollographql.com"],
    credentials: true,
  };

  app.use(expressSession);
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(cors(corsOptions));

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    json(),
    cookieParser(),
    expressMiddleware(server, {
      context: async ({ req, res }: any) => {
        // console.log(req.session);
        // console.log(req.user);
        return { req, res };
      },
    })
  );

  //Google Auth
  app.get("/", (req, res) => {
    res.send('<a href="/auth/google">Auth with Google</a>');
  });

  app.use("/auth", authRoutes);

  app.get("/protected", isAuthenticated, (req, res) => {
    console.log(req.user);
    res.send("Congrats, you are authenticated");
  });

  app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server ready at ${host}:${port}/graphql`);
};
