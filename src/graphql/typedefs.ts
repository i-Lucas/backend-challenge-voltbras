import { gql } from "apollo-server";

const typeDefs = gql`

    type Query {
        users: String
    }

`;

export default typeDefs;