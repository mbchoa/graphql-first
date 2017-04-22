const { graphql, buildSchema } = require('graphql');
const express = require('express');
const graphqlMiddleware = require('express-graphql');

const schema = buildSchema(`
    type Query {
        hello: String
    }
`);

const root = {
    hello () {
        return 'Hello World';
    },
};

const app = express();
app.use('/graphql', graphqlMiddleware({
    schema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000, () => console.log('Running GraphQL server at port localhost:4000/graphql'));
