import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServer } from "@apollo/server";
import express from "express";
import http from "http";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import { schema, setHttpPlugin } from "./serverSettings/config";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import passport from "passport";
import authRoutes from "./routes/auth";
import "./services/passport";
import { expressSession } from "./services/session";
import { isAuthenticated } from "./middlewares/isAuthenticated";

//config variables
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

  app.use(expressSession);
  app.use(passport.initialize());
  app.use(passport.session());

  const corsOptions = {
    origin: ["http://localhost:3000", "https://studio.apollographql.com"],
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  };

  app.use(cors(corsOptions));

  app.use(
    "/graphql",
    // isLoggedIn,
    // cors<cors.CorsRequest>(corsOptions),
    json(),
    cookieParser(),
    expressMiddleware(server, {
      context: async ({ req, res }: any) => {
        return { req, res };
      },
    })
  );

  //Google Auth
  app.get("/", (req, res) => {
    res.send('<a href="/auth/google">Auth with Google</a>');
  });

  app.get("/protected", isAuthenticated, (req, res) => {
    res.send("Congrats, you are authenticated");
  });

  app.use("/auth", authRoutes);

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server ready at ${host}:${port}/graphql`);
};
