const { graphql, buildSchema } = require('graphql');
const express = require('express');
const graphqlMiddleware = require('express-graphql');

const schema = buildSchema(`
    type Query {
        hello: String
        quoteOfTheDay: String
        random: Float!
        rollThreeDice: [Int]
        rollDice(numDice: Int!, numSides: Int): [Int]
    }
`);

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
    }
};

const app = express();
app.use('/graphql', graphqlMiddleware({
    schema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000, () => console.log('Running GraphQL server at port localhost:4000/graphql'));
