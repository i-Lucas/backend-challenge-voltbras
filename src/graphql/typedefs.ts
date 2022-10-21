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

    type StationHistory {
        id: Int!
        user: String!
        stationID: Int!
        date: String!
        time: String!
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
        stationHistory(stationID: Int!): [StationHistory]!
    }
`;

export default typeDefs;