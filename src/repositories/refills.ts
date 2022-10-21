import prisma from "../config/db.js";
import { refills } from "@prisma/client";

async function registerRecharge
    (userID: number, stationID: number, endRecharge: GLfloat): Promise<refills> {

    return await prisma.refills.create({
        data: {
            userID,
            stationID,
            startRecharge: Date.now(),
            endRecharge
        }
    })
};

async function getAllUserRecharges(userID: number): Promise<refills[]> {

    return await prisma.refills.findMany({
        where: {
            userID
        },
        orderBy: {
            endRecharge: "desc"
        }
    })
};

const rechargesRepository = {
    registerRecharge,
    getAllUserRecharges
};

export default rechargesRepository;