const { graphql, buildSchema } = require('graphql');
const express = require('express');
const graphqlMiddleware = require('express-graphql');

const schema = buildSchema(`
    type Query {
        hello: String
        quoteOfTheDay: String
        random: Float!
        rollThreeDice: [Int]
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
    }
};

const app = express();
app.use('/graphql', graphqlMiddleware({
    schema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000, () => console.log('Running GraphQL server at port localhost:4000/graphql'));
