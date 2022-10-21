import planetsRepository from "../repositories/planets-repo.js";
import planetServices from "../services/planets.js";
import stationService from "../services/stations.js";
import userServices from "../services/users.js";

const resolvers = {

    Query: {
        suitablePlanets: async () => await planetsRepository.getAllSuitablePlanets(),
        stations: async () => await stationService.getAllStations(),
    },

    Mutation: {

        installStation: async (_: any, { planetID }: any) => await planetServices.installStationInPlanet(planetID),

        signup: async (_: any, { email, password }: any) => await userServices.signup(email, password),
        signin: async (_: any, { email, password }: any) => await userServices.signin(email, password),

        recharge: async (_: any, { token, stationID, hours }: any) => await stationService.rechargeStation(token, stationID, hours)
    }
};

export default resolvers;