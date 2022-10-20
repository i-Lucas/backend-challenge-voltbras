import planetsRepository from "../repositories/planets-repo.js";
import planetServices from "../services/planets.js";

const resolvers = {

    Query: {
        suitablePlanets: async () => await planetsRepository.getAllSuitablePlanets(),
        stations: async () => await planetsRepository.getAllPlanetsHasInstallations()
    },

    Mutation: {

        installStation: async (_: any, args: any) => await planetServices.installStationInPlanet(args.id)
    }
};

export default resolvers;