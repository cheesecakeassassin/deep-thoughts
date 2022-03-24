const express = require('express');
// Import ApolloServer
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');

// Import out typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');

const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

const startServer = async () => {
  // Create a new Apollo server and pass in our schema data
  const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: authMiddleware
  });

  // Start the Apollo server
  await server.start();

  // Integrate our Apollo server witht he Express application as middleware
  server.applyMiddleware({ app });

  // Log where we can go to test our GQL API
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

// Initialize the Apollo server
startServer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
