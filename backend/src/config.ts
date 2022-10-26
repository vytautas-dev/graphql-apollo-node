import { applyMiddleware } from "graphql-middleware";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "./typedefs/typeDefs";
import { resolvers } from "./resolvers/resolvers";
import permissions from "./helpers/permissions";

export const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs,
    resolvers,
  }),
  permissions
);

export const setHttpPlugin = {
  async requestDidStart() {
    return {
      async willSendResponse({ response }: any) {
        response.http.headers.set("custom-header", "hello");

        if (
          response.body.kind === "single" &&
          response.body.singleResult.errors?.[0]?.extensions?.code ===
            "BAD_USER_INPUT"
        ) {
          response.http.status = 400;
        }
      },
    };
  },
};
