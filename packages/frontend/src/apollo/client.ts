import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

// TODO: add config from env
export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:4000/graphql" }),
  cache: new InMemoryCache(),
});
