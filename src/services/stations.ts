import userServices from "./users.js";
import { stations } from "@prisma/client";
import usersRepository from "../repositories/users-repo.js";
import rechargesRepository from "../repositories/refills-repo.js";
import stationsRepository from "../repositories/stations-repo.js";
import { formatedDate, formatedHour, formatTime } from "../utils/time.js";

type RechargeEndsFormatted = Omit<stations, "rechargeEnds">;

type StationHistory = {
    id: number
    user: string
    stationID: number
    date: String
    time: String
};

async function getAllStations(): Promise<RechargeEndsFormatted[]> {

    const allStations = await stationsRepository.getAllStations();

    function formatFloatToDateString(list: stations[]) {

        return list.map(station => {
            return {
                ...station,
                rechargeEnds: station.rechargeEnds !== 0 ?
                    formatTime(station.rechargeEnds) :
                    "not started"
            };
        });
    };

    return formatFloatToDateString(allStations);
};

async function rechargeStation(token: string, stationID: number, hours: number): Promise<stations["id"]> {

    const user = await userServices.getUserByToken(token);
    const station = await stationsRepository.getStationById(stationID);
    if (!station) throw new Error("404 this station id does not exist");

    if (station.rechargeEnds > new Date().getTime()) {
        throw new Error("409 this station already has a recharge in progress");

    } else {
        if (station.isRecharging) {
            const isRecharging = false;
            const endRecharge = 0;
            await stationsRepository.updataStationStatus(stationID, isRecharging, endRecharge);
        }
    };

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

async function getStationHistory(stationID: number): Promise<StationHistory[]> {
    
    const station = await stationsRepository.getStationById(stationID);
    if (!station) throw new Error("404 this station id does not exist");

    const history = await rechargesRepository.getStationRechargeHistory(stationID);
    const result = history.map(async recharge => {

        return {
            id: recharge.id,
            user: await usersRepository.getUserEmailByID(recharge.userID),
            stationID: recharge.stationID,
            date: formatedDate(recharge.startRecharge),
            time: `from: ${formatedHour(recharge.startRecharge)} to: ${formatedHour(recharge.endRecharge)}`
        }
    });

    return await Promise.all(result);
};

const stationService = {
    getAllStations,
    rechargeStation,
    getStationHistory
};

export default stationService;