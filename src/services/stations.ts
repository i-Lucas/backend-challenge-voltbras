import userServices from "./users.js";
import { stations } from "@prisma/client";
import rechargesRepository from "../repositories/refills.js";
import stationsRepository from "../repositories/stations-repo.js";

type RechargeEndsFormatted = Omit<stations, "rechargeEnds">;

async function getAllStations(): Promise<RechargeEndsFormatted[]> {

    const allStations = await stationsRepository.getAllStations();

    function formatFloatToDateString(list: stations[]) {

        return list.map(station => {
            return {
                ...station,
                rechargeEnds:
                    station.rechargeEnds !== 0 ?
                        formatTime(station.rechargeEnds)
                        : "not started"
            }
        })
    };

    return formatFloatToDateString(allStations);
};

async function rechargeStation(token: string, stationID: number, hours: number): Promise<stations["id"]> {

    // verificar se o usuário está autenticado
    const user = await userServices.getUserByToken(token);

    // verificar se a estação existe
    const station = await stationsRepository.getStationById(stationID);
    if (!station) throw new Error("404 this station id does not exist");

    // verificar se a estação já está sendo carregada
    if (station.rechargeEnds > new Date().getTime()) {
        throw new Error("this station already has a recharge in progress");

    } else {
        if (station.isRecharging) {
            const isRecharging = false;
            const endRecharge = 0;
            await stationsRepository.updataStationStatus(stationID, isRecharging, endRecharge);
        }
    };

    // verificar se o usuário não tem nenhuma recarga em andamento
    const userRecharges = await rechargesRepository.getAllUserRecharges(user.id);

    if (userRecharges.length !== 0) {

        const lastUserRechargeExpirationTime = userRecharges[0].endRecharge;
        if (lastUserRechargeExpirationTime > new Date().getTime()) {

            const message = `
                401 you must wait for the end of your previous recharge\n
                expiration: ${formatTime(lastUserRechargeExpirationTime)}\n
                Station: ${userRecharges[0].stationID}
            `;

            throw new Error(message);
        };
    };

    const endRecharge = new Date().getTime() + hours * 60 * 60 * 1000;
    await rechargesRepository.registerRecharge(user.id, stationID, endRecharge);

    const isRecharging = true;
    await stationsRepository.updataStationStatus(stationID, isRecharging, endRecharge);

    return station.id
};

function formatTime(time: GLfloat) {
    return new Date(time).toLocaleString("pt-br").toString()
};

const stationService = {
    getAllStations,
    rechargeStation
};

export default stationService;