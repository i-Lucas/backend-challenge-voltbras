import checkRawData from "./services/bootstrap.js";


(async function  () {

    const initialize = await checkRawData();
    console.log(initialize);
})()