import fs from "fs";
import axios from "axios";
import * as readline from "readline";
import dotenv from "dotenv";

let TOTAL_SEARCH_TIME = 0;
dotenv.config();

(function startFetching() {

    const reader = readline.createInterface({ input: process.stdin, output: process.stdout });
    reader.question("This operation may take a few minutes. Continue ? (Y / N) ", function (answer) {
        answer === "y" || answer === "Y" ? printFetching(reader.output) : console.log("canceled");
        reader.close();
    });

})();

function printFetching(output) {

    const interval = setInterval(() => {

        output.write(".");
        if (TOTAL_SEARCH_TIME % 4 === 0) {
            readline.clearLine(output, 0);
            output.write("\rfetching data ");
        };

        TOTAL_SEARCH_TIME++;
    }, 1000);

    runAxios(interval);
};

async function runAxios(interval) {

    await axios
        .get(process.env.API_URL)
        .then(({ data }) => saveData(JSON.stringify(data)))
        .catch(err => newThrow("an error occurred while fetching the data", err));

    clearInterval(interval);
};

function saveData(data) {

    const basedata = "./api/rawdata.json";
    console.log(`\ntotal search time: ${TOTAL_SEARCH_TIME + "s"}`);

    fs.unlink(basedata, function (err) {
        if (!err) console.log("old data deleted");
    });

    fs.writeFile(basedata, data, (err) => {
        if (err) { newThrow("an error occurred while saving the data", err) };
        console.log("data has been updated successfully");
    });
};

function newThrow(name, err) {
    throw { name, err };
};