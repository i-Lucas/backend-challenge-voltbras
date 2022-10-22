import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { users } from "@prisma/client";
import usersRepository from "../repositories/users-repo.js";

async function signup(email: string, password: string): Promise<users["id"]> {

    const user = await usersRepository.getUserByEmail(email);
    if (user) throw new Error("409 this user is already registered");

    validate(email, password);

    const crypt = await bcrypt.hash(password, 10);
    return await usersRepository.createNewUser(email, crypt);
};

async function signin(email: string, password: string): Promise<String> {

    const user = await usersRepository.getUserByEmail(email);
    if (!user) throw new Error("404 this user is not registered");

    if (!(await bcrypt.compare(password, user.password))) {
        throw new Error("401 bad password");
    };

    const expiresIn = 60 * 60; // 1 hour
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn });
};

async function getUserByToken(token: string): Promise<users> {

    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    if (!tokenData) throw new Error("401 not authorized. please login before continuing")

    const user = await usersRepository.getUserByEmail((<users>tokenData).email);
    if (!user) throw new Error("401 invalid token");

    return user;
};

function validate(email: string, password: string): boolean {

    if (email.length < 5) throw new Error("400 invalid email");
    if (password.length < 5) throw new Error("400 invalid password");
    return true;
};

const userServices = {
    signup,
    signin,
    getUserByToken
};

export default userServices;