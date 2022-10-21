import checkRawData from "./services/bootstrap.js";

import { ApolloServer } from "apollo-server";
import typeDefs from "./graphql/typedefs.js"
import resolvers from "./graphql/resolvers.js";

(async function () {

    const initialize = await checkRawData();

    if (initialize) {

        new ApolloServer({ typeDefs, resolvers }).listen().then(({ url }) => {
            console.log(`http server running on ${url}`)
        });
    };

})();