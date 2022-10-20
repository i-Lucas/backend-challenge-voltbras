import planetsRepository from "../repositories/planets-repo.js";

async function installStationInPlanet(id: number) {

    const { hasStation } = await planetsRepository.checkPlanetHasInstallation(id);
    if(hasStation) throw new Error("this planet already has a facility");

    return await planetsRepository.installStationOnPlanet(id);
};

const planetServices = {
    installStationInPlanet
};

export default planetServices;