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

const usersRepository = {
    createNewUser,
    getUserByEmail
};

export default usersRepository;