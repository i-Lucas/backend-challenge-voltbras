const { ApolloServer } = require("apollo-server");

const typeDefs = `#graphql
  type Query {
    hello(name: String): String!
  }
`;

const resolvers = {
    Query: {
        hello: (_, { name }) => `Hello ${name}!`,
    },
};

describe("testing the tests", () => {

    it('returns hello with the provided name', async () => {

        const server = new ApolloServer({ typeDefs, resolvers, });
        const response = await server.executeOperation({
            query: 'query SayHelloWorld($name: String) { hello(name: $name) }',
            variables: { name: 'Lucas' },
        });

        expect(response.data.hello).toBe("Hello Lucas!")
    });
});