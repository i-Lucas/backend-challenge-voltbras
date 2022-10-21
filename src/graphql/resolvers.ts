import planetsRepository from "../repositories/planets-repo.js";
import planetServices from "../services/planets.js";
import userServices from "../services/users.js";

const resolvers = {

    Query: {
        suitablePlanets: async () => await planetsRepository.getAllSuitablePlanets(),
        stations: async () => await planetsRepository.getAllPlanetsHasInstallations(),
    },

    Mutation: {

        installStation: async (_: any, { id }: any) => await planetServices.installStationInPlanet(id),

        signup: async (_: any, { email, password }: any) => await userServices.signup(email, password),
        signin: async (_: any, { email, password }: any) => await userServices.signin(email, password)
    }
};

export default resolvers;