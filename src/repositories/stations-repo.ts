import prisma from "../config/db.js";
import { stations } from "@prisma/client";

async function createNewStation(planetID: number): Promise<stations> {

    return await prisma.stations.create({
        data: {
            planetID,
            isRecharging: false,
            rechargeEnds: 0
        }
    })
};

async function getAllStations(): Promise<stations[]> {
    return await prisma.stations.findMany();
};

async function getStationById(id: number): Promise<stations> {

    return await prisma.stations.findFirst({
        where: {
            id
        }
    })
};

async function updataStationStatus(id: number, isRecharging: boolean, rechargeEnds: GLfloat) {

    await prisma.stations.update({
        where: {
            id
        },
        data: {
            isRecharging,
            rechargeEnds
        }
    })
};

const stationsRepository = {
    createNewStation,
    getAllStations,
    getStationById,
    updataStationStatus
};

export default stationsRepository;