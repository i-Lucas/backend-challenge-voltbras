import checkRawData from "./services/bootstrap.js";
import startServer from "./server/index.js";

(async function () {

    const initialize = await checkRawData();
    if (initialize) {
        startServer();
    }
})();