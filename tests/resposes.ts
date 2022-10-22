const suitablePlanets = {
    query: `query SuitablePlanets {
        suitablePlanets {
          mass
        }
      }`
};

const stations = {
    query: `query Stations {
        stations {
          planetID
        }
      }`
};

const responses = {
    suitablePlanets,
    stations
};

export default responses;