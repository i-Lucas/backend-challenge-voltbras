import { gql } from "apollo-server";

const typeDefs = gql`

    type Planets {
    
        id: Int!, 
        name: String!,
        mass: Float!
        hasStation: Boolean!
    }

    type Query {
        suitablePlanets: [Planets!]!
        stations: [Planets!]!
    }

    type Mutation {
        installStation (id: Int!): ID!
    }

`;

export default typeDefs;