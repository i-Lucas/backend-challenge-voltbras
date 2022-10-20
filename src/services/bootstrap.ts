import fs from "fs";
import { planets } from "@prisma/client";
import planetsRepository from "../repositories/planets-repo.js";

const RAW_DATA_PATH = "./api/rawdata.json";
const PROCESSED_DATA_PATH = "./api/processed.json";
const MULTIPLIER_FACTOR = 10; // 10x jupter mass

export default async function checkRawData(): Promise<Boolean> {

    return await fs.promises.readFile(RAW_DATA_PATH).then(async res => {
        return await checkProcessedData();

    }).catch(err => {
        if (err.code === 'ENOENT') return requireFileError() && false; // fixme !
    })
};

async function checkProcessedData() {

    return await fs.promises.readFile(PROCESSED_DATA_PATH).then(async res => {
        const processedData = JSON.parse(fs.readFileSync(PROCESSED_DATA_PATH, 'utf-8'));
        return await addNewPlanets(processedData);

    }).catch(async err => {
        const rawdata = JSON.parse(fs.readFileSync(RAW_DATA_PATH, 'utf-8'));
        return await processRawData(rawdata);
    })
};

async function processRawData(rawdata: JSON): Promise<Boolean> {

    const suitables = filterSuitablePlanets(JSON.parse(JSON.stringify(rawdata)));
    const formattedPlanets = formatPlanetData(suitables);
    await saveProcessedData(formattedPlanets);
    return await addNewPlanets(formattedPlanets);
};

function filterSuitablePlanets(list: Object[]) {
    return list.filter((obj: { pl_bmassj: number }) => obj.pl_bmassj >= MULTIPLIER_FACTOR);
};

function formatPlanetData(list: any[]): planets[] {

    return list.map(({ pl_bmassj, pl_name }:
        { pl_name: string, pl_bmassj: GLfloat }, id: number) => {
        return { id: id + 1, name: pl_name, mass: pl_bmassj, hasStation: false };
    });
};

async function addNewPlanets(list: planets[]): Promise<Boolean> {

    const planetsDBidList = await planetsRepository.getPlanetsIDList();

    if (planetsDBidList.length === 0) {
        console.log(list.length + " suitable planets registered in the system");
        return await planetsRepository.saveSuitablePlanets(list);
    };

    if (planetsDBidList.length !== list.length) {
        return await searchNewRecords(list, planetsDBidList);
    }

    else return true;
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

async function saveProcessedData(data: planets[]) {
    fs.writeFile(PROCESSED_DATA_PATH, JSON.stringify(data), (err) => {
        if (err) { console.log("error saving preprocessed data"); };
        console.log("preprocessed data successfully saved");
    });
};

function requireFileError(): Error {
    throw new Error("\n\nThe raw data file was not found\nrun 'npm run update' command to download the data\n");
};