import typeDefs from "../src/graphql/typedefs.js";
import resolvers from "../src/graphql/resolvers.js";

import checkRawData from "../src/services/bootstrap.js";
import userServices from "../src/services/users.js";

import responses from "./resposes.js";
import mutations from "./mutations.js";

import { ApolloServer } from "apollo-server";
const server = new ApolloServer({ typeDefs, resolvers });

beforeAll(async () => {
    await checkRawData();
});

describe("testing the queries", () => {

    it("should return a list of planets", async () => {
        const response = await server.executeOperation(responses.suitablePlanets);
        expect(response.data.suitablePlanets[0]).toHaveProperty("mass");
        expect(response.data.suitablePlanets).toHaveLength(172);
    });

    it("should return undefined", async () => {
        const response = await server.executeOperation(responses.stations);
        expect(response.data.stations[0]).toBeUndefined();
        expect(response.data.stations).toHaveLength(0);
    });
});

describe("testing the mutations of planets", () => {

    it("should create a new station on planet id 1", async () => {
        const response = await server.executeOperation(mutations.installStation(1));
        expect(response.data).toMatchObject({ "installStation": "1" });
    });

    it("should not allow creating a new station on the same planet", async () => {
        const response = await server.executeOperation(mutations.installStation(1));
        expect(response.errors[0].message).toBe("this planet already has a facility");
    });
});

describe("testing the mutations of login", () => {

    it("it should be possible to register a user", async () => {
        const response = await server.executeOperation(mutations.signup("lucas@", "12345"));
        expect(response.data).toMatchObject({ signup: '1' });
    });

    it("should give error when registering the same user", async () => {
        const response = await server.executeOperation(mutations.signup("lucas@", "12345"));
        expect(response.errors[0].message).toBe("409 this user is already registered");
    });

    it("error when trying to enter a password of invalid length", async () => {
        const response = await server.executeOperation(mutations.signup("laura@", "1"));
        expect(response.errors[0].message).toBe("400 invalid password");
    });

    it("error when trying to register an email of invalid size", async () => {
        const response = await server.executeOperation(mutations.signup("f@", "12322562"));
        expect(response.errors[0].message).toBe("400 invalid email");
    });

    it("it should be possible to log in", async () => {
        const response = await server.executeOperation(mutations.signin("lucas@", "12345"));
        const token = response.data.signin;
        const { email } = await userServices.getUserByToken(token);
        expect(response.data.signin).toBeDefined();
        expect(email).toBe("lucas@");
    });

    it("it should give an error when trying to log in with the wrong password", async () => {
        const response = await server.executeOperation(mutations.signin("lucas@", "xuxu"));
        expect(response.errors[0].message).toBe("401 bad password");
    });

    it("it should give an error when trying to log in a user that does not exist", async () => {
        const response = await server.executeOperation(mutations.signin("docker@", "compose"));
        expect(response.errors[0].message).toBe("404 this user is not registered");
    });
});

describe("testing the mutations of recharge", () => {

    let token = "string"; // todo implement the token factory
    const stationId = 1;
    const rechargeTime = 2;

    it("given a user and an existing station it should be possible to recharge the station", async () => {

        const responseSignin = await server.executeOperation(mutations.signin("lucas@", "12345"));
        token = responseSignin.data.signin;

        const response = await server.executeOperation(mutations.recharge(token, stationId, rechargeTime));
        expect(response.data).toMatchObject({ recharge: '1' });
    });

    it("error when trying to recharge a station that has a recharge in progress", async () => {
        const response = await server.executeOperation(mutations.recharge(token, stationId, rechargeTime));
        expect(response.errors[0].message).toBe("409 this station already has a recharge in progress");
    });

    it("error when trying to load a station that does not exist", async () => {
        const stationId = 5;
        const response = await server.executeOperation(mutations.recharge(token, stationId, rechargeTime));
        expect(response.errors[0].message).toBe("404 this station id does not exist");
    });

    it("the user must wait to perform the next recharge", async () => {

        const installStation = await server.executeOperation(mutations.installStation(2));
        expect(installStation.data).toMatchObject({ "installStation": "2" });

        const stationId = 2;
        const response = await server.executeOperation(mutations.recharge(token, stationId, rechargeTime));
        expect(response.data).toBeNull();
    });

    it("it should be possible to search the recharge history", async () => {

        const response = await server.executeOperation(mutations.stationHistory(stationId));
        expect(response.data.stationHistory[0].user).toBe("lucas@");
        expect(response.data.stationHistory[0].stationID).toBe(stationId);
    });

    it("it shouldn't be possible to see the history of a station that doesn't exist", async () => {
        const response = await server.executeOperation(mutations.stationHistory(8));
        expect(response.errors[0].message).toBe("404 this station id does not exist");
    });
});