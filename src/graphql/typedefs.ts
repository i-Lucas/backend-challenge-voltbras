import { gql } from "apollo-server";

const typeDefs = gql`

    type Planet {
    
        id: Int!, 
        name: String!,
        mass: Float!
        hasStation: Boolean!
    }

    type Station {
        id: Int!,
        planetID: Int!,
        isRecharging: Boolean!,
        rechargeEnds: String!
    }

    type User {
        id: Int!,
        email: String!,
        password: String!
    }

    type Query {
        suitablePlanets: [Planet!]!
        stations: [Station!]!
    }

    type Mutation {

        installStation (planetID: Int!): ID!
        signup (email: String!, password: String!): ID!
        signin (email: String!, password: String!): String!

        recharge (token: String!, stationID: Int!, hours: Int!): ID!
    }
`;

export default typeDefs;