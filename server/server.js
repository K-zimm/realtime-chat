const { GraphQLServer, PubSub } = require('graphql-yoga');
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

  type Subscription {
    messages: [Message!]
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

const subscribers = [];
const messages = async () => await Message.find();
const onMessagesUpdates = (fn) => subscribers.push(fn);

const resolvers = {
  Date: dateScalar,
  Query: {
    messages: async () => {
      try {
        return messages;
      } catch (error) {
        console.log('Error', error);
        return [];
      }
    }
  },
  Mutation: {
    postMessage: async (parent, { user, content }) => {
      console.log('Posting');
      try {
        const newId = await Message.create({
          datetime: new Date(),
          user,
          content
        }).then((newMessage) => {
          subscribers.forEach((fn) => fn());
          return newMessage._id.valueOf();
        });
        return newId;
      } catch (error) {
        console.log('Error', error);
        return [];
      }
    }
  },
  Subscription: {
    messages: {
      subscribe: async (parent, args, { pubsub }) => {
        console.log('subscribing');
        const channel = Math.random().toString(36).slice(2, 15);
        onMessagesUpdates(() => pubsub.publish(channel, { messages }));
        setTimeout(() => pubsub.publish(channel, { messages }), 0);
        return pubsub.asyncIterator(channel);
      }
    }
  }
};

const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });

server.start(({ port }) => {
  console.log(`Server on http://localhost:${port}`);
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Database Connected');
});
