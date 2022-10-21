import prisma from "../config/db.js";
import { users } from "@prisma/client";

async function createNewUser(email: string, password: string): Promise<users["id"]> {

    const { id } = await prisma.users.create({
        data: {
            email,
            password
        }
    });

    return id;
};

async function getUserByEmail(email: string): Promise<users> {

    return await prisma.users.findUnique({
        where: {
            email
        }
    });
};

async function getUserEmailByID(userID: number): Promise<users["email"]> {

    const { email } = await prisma.users.findFirst({
        where: {
            id: userID
        }
    });

    return email;
};

const usersRepository = {
    createNewUser,
    getUserByEmail,
    getUserEmailByID
};

export default usersRepository;