import prisma from "../config/db.js";
import { planets } from "@prisma/client";

type planetsDBidList = Omit<planets, "name" | "mass" | "hasStation">;

async function saveSuitablePlanets(data: planets[]): Promise<Boolean> {
    await prisma.planets.createMany({ data });
    return true;
};

async function getPlanetsIDList(): Promise<planetsDBidList[]> {
    return await prisma.planets.findMany({
        select: {
            id: true
        }
    });
};

async function getAllSuitablePlanets(): Promise<planets[]> {
    return await prisma.planets.findMany({
        orderBy: {
            mass: 'desc',
        }
    });
};

async function installStationOnPlanet(id: number): Promise<Number> {

    const planet = await prisma.planets.update({
        where: {
            id: id
        },
        data: {
            hasStation: true
        }
    });

    return planet.id;
};

async function checkPlanetHasInstallation(id: number): Promise<planets> {

    return await prisma.planets.findUnique({
        where: {
            id: id
        }
    });
};

async function getAllPlanetsHasInstallations() {
    return await prisma.planets.findMany({
        where: {
            hasStation: true
        }
    })
};

const planetsRepository = {
    saveSuitablePlanets,
    getPlanetsIDList,
    getAllSuitablePlanets,
    installStationOnPlanet,
    checkPlanetHasInstallation,
    getAllPlanetsHasInstallations
};

export default planetsRepository;