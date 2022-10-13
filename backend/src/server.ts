import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema/schema";
import "dotenv/config";

console.log(graphqlHTTP);

const app = express();

//config variables
const port = process.env.PORT;
const host = process.env.HOST;
const dbUri = process.env.DB_URI;
const nodeEnv = process.env.NODE_ENV;

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: nodeEnv === "development",
  })
);

app.listen(port, host, () =>
  console.log(`Server is running at http//${host}:${port}`)
);
