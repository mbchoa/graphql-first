const { graphql, buildSchema } = require('graphql');
const express = require('express');
const graphqlMiddleware = require('express-graphql');
const RandomDie = require('./RandomDie');
const Message = require('./Message');

const schema = buildSchema(`
    type RandomDie {
        numSides: Int!,
        numDice: Int!,
        rollOnce: Int!,
        roll(numRolls: Int!): [Int]
    }

    input MessageInput {
        content: String
        author: String
    }

    type Message {
        id: ID!
        content: String
        author: String
    }

    type Mutation {
        createMessage(input: MessageInput): Message
        updateMessage(id: ID!, input: MessageInput): Message
    }

    type Query {
        hello: String
        quoteOfTheDay: String
        random: Float!
        rollThreeDice: [Int]
        rollDice(numDice: Int!, numSides: Int): [Int]
        getDie(numSides: Int!): RandomDie
        getMessage(id: ID!): Message
        getAllMessages: [Message]
    }
`);

var fakeDb = {};

const root = {
    hello () {
        return 'Hello World';
    },
    quoteOfTheDay () {
        return 'Never give up!';
    },
    random () {
        return Math.random();
    },
    rollThreeDice () {
        return [1, 1, 1]
            .map(dice => Math.floor(Math.random() * 6) + 1);
    },
    rollDice ({ numDice, numSides}) {
        const output = [];
        for (let i = 0; i < numDice; i++) {
            output.push(1 + Math.floor(Math.random() * (numSides || 6)));
        }
        return output;
    },
    getDie ({ numSides }) {
        return new RandomDie(numSides || 6);
    },
    setMessage ({ message }) {
        fakeDb.message = message;
        return message;
    },
    getMessage ({ id }) {
        if (!fakeDb[id]) {
            throw new Error('no message exists with id ' + id);
        }
        return new Message(id, fakeDb[id]);
    },
    getAllMessages () {
        const output = [];
        for (let id in fakeDb) {
            output.push(new Message(id, fakeDb[id]));
        }
        console.log(output);
        return output;
    },
    createMessage ({ input }) {
        var id = Math.floor(Math.random() * 100);
        fakeDb[id] = input;
        return new Message(id, input);
    },
    updateMessage ({ id, input }) {
        if (!fakeDb[id]) {
            throw new Error('no message exists with id ' + id);
        }
        fakeDb[id] = input;
        return new Message(id, input);
    }
};

const app = express();
app.use('/graphql', graphqlMiddleware({
    schema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000, () => console.log('Running GraphQL server at port localhost:4000/graphql'));
