import fs from "fs";
import { planets } from "@prisma/client";
import planetsRepository from "../repositories/planets-repo.js";

const DATAPATH = "./api/rawdata.json";
const MULTIPLIER_FACTOR = 10; // 10x jupter mass

export default async function checkRawData(): Promise<Boolean> {

    try {

        await fs.promises.readdir(DATAPATH);

    } catch (err) {

        if (err.code === 'ENOENT') {
            throw new Error("\n\nThe raw data file was not found\nrun 'npm run fetch' command to download the data\n");
        };
    };

    const data = JSON.parse(fs.readFileSync(DATAPATH, 'utf-8'));
    return await processData(data);
};

async function processData(rawdata: JSON): Promise<Boolean> {

    const suitables = filterSuitablePlanets(JSON.parse(JSON.stringify(rawdata)));
    const formattedPlanets = formatPlanetData(suitables);
    return await addNewPlanets(formattedPlanets);
};

function filterSuitablePlanets(list: Object[]) {
    return list.filter((obj: { pl_bmassj: number }) => obj.pl_bmassj >= MULTIPLIER_FACTOR);
};

function formatPlanetData(list: any[]): planets[] {

    return list.map(({ pl_bmassj, pl_name }: { pl_name: string, pl_bmassj: GLfloat }, id: number) => {
        return {
            id: id + 1,
            name: pl_name,
            mass: pl_bmassj,
            hasStation: false
        };
    });
};

async function addNewPlanets(list: planets[]): Promise<Boolean> {

    const planetsDBidList = await planetsRepository.getPlanetsIDList();

    if (planetsDBidList.length === 0) {
        console.log(list.length + " suitable planets registered in the system");
        return await planetsRepository.saveSuitablePlanets(list);

    } else {
        return await searchNewRecords(list, planetsDBidList);
    };
};

async function searchNewRecords(list: planets[], dblist: { id: number; }[]): Promise<Boolean> {

    const newPlanets = list.filter((item, index) => {
        if (!dblist[index]) return list[index];
        else return item.id !== dblist[index].id
    });

    if (newPlanets.length !== 0) {
        console.log(newPlanets.length + " new planets discovered");
        await planetsRepository.saveSuitablePlanets(newPlanets);
    };

    return true;
};