import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql`

    type Query {
        users: String
    }

`;

const server = new ApolloServer({

    typeDefs,

    resolvers: {

        Query: {
            users: () => "Hello World"
        }
    }
});

export default function startServer() {
    server.listen().then(({ url }) => console.log(`http server running on ${url}`));
};