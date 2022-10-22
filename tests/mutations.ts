function installStation(planetId: number) {

    return {
        query: `mutation InstallStation($planetId: Int!) {
            installStation(planetID: $planetId)
          }`,
        variables: { planetId },
    };
};

function signup(email: string, password: string) {

    return {
        query: `mutation Signup($email: String!, $password: String!) {
            signup(email: $email, password: $password)
          }`,
        variables: { email, password },
    };
};

function signin(email: string, password: string) {

    return {
        query: `mutation Signin($email: String!, $password: String!) {
            signin(email: $email, password: $password)
          }`,
        variables: { email, password },
    };
};

function recharge(token: string, stationId: number, hours: number) {

    return {
        query: `mutation Recharge($token: String!, $stationId: Int!, $hours: Int!) {
            recharge(token: $token, stationID: $stationId, hours: $hours)
          }`,
        variables: {
            token,
            stationId,
            hours
        },
    };
};

function stationHistory(stationId: number) {

    return {
        query: `mutation StationHistory($stationId: Int!) {
            stationHistory(stationID: $stationId) {
              id
              stationID
              date
              time
              user
            }
          }`,
        variables: { stationId },
    };
};

const mutations = {
    installStation,
    signup,
    signin,
    recharge,
    stationHistory
};

export default mutations;