const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./config/db');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
require('dotenv').config();

const app = express();
app.use(express.json());
connectDB();

const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
  server.applyMiddleware({ app, path: '/graphql' });
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}${server.graphqlPath}`);
  });
});
