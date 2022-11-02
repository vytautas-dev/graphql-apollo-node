import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthProvider";
import { ApolloProvider } from "@apollo/client";
import { client } from "./graphql/client";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>
);
