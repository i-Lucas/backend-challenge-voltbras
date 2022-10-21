import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { users } from "@prisma/client";
import usersRepository from "../repositories/users-repo.js";

async function signup(email: string, password: string): Promise<users["id"]> {

    const user = await usersRepository.getUserByEmail(email);
    if (user) throw new Error("409 this user is already registered");

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

const userServices = {
    signup,
    signin
};

export default userServices;