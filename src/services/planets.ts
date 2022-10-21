import planetsRepository from "../repositories/planets-repo.js";
import stationsRepository from "../repositories/stations-repo.js";

async function installStationInPlanet(id: number) {

    const { hasStation, id: planetID } = await planetsRepository.checkPlanetHasInstallation(id);
    if(hasStation) throw new Error("this planet already has a facility");

    await stationsRepository.createNewStation(planetID);
    return await planetsRepository.installStationOnPlanet(id);
};

const planetServices = {
    installStationInPlanet
};

export default planetServices;