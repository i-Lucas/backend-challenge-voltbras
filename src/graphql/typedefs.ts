import { gql } from "apollo-server";

const typeDefs = gql`

    type Planet {
    
        id: Int!, 
        name: String!,
        mass: Float!
        hasStation: Boolean!
    }

    type User {
        id: Int!,
        email: String!,
        password: String!
    }

    type Query {
        suitablePlanets: [Planet!]!
        stations: [Planet!]!
    }

    type Mutation {

        installStation (id: Int!): ID!
        signup (email: String!, password: String!): ID!
        signin (email: String!, password: String!): String!
    }

`;

export default typeDefs;