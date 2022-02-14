const { GraphQLServer } = require('graphql-yoga');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tquju.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;

const messageSchema = new mongoose.Schema({
  datetime: String,
  user: String,
  content: String
});

const Message = mongoose.model('Message', messageSchema);

const messages = [];

const typeDefs = `
  scalar Date

  type Message {
    id: ID!
    datetime: Date!,
    user: String!
    content: String!
  }

  type Query {
    messages: [Message!]
  }

  type Mutation {
    postMessage(user: String!, content: String!): String!
  }
`;

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return value;
  }
});

const resolvers = {
  Date: dateScalar,
  Query: {
    messages: async () => {
      try {
        const allMessages = await Message.find();
        return allMessages;
      } catch (error) {
        console.log('Error', error);
        return [];
      }
    }
  },
  Mutation: {
    postMessage: async (parent, { user, content }) => {
      try {
        const newMessage = await Message.create({
          datetime: new Date(),
          user,
          content
        });
        return newMessage._id.valueOf();
      } catch (error) {
        console.log('Error', error);
        return [];
      }
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(({ port }) => {
  console.log(`Server on http://localhost:${port}`);
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Database Connected');
});
