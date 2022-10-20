import prisma from "../config/db.js";
import { planets } from "@prisma/client";

async function saveSuitablePlanets(data: planets[]): Promise<Boolean> {
    await prisma.planets.createMany({ data });
    return true;
};

async function getPlanetsIDList() {
    return await prisma.planets.findMany({ select: { id: true } });
};

const planetsRepository = {
    saveSuitablePlanets,
    getPlanetsIDList
};

export default planetsRepository;