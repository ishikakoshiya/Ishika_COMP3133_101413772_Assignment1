const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./config/db');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
require('dotenv').config();

const app = express();
connectDB();

const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
  server.applyMiddleware({ app });
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}${server.graphqlPath}`);
  });
});
