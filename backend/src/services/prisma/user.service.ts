import prisma from "@DB"
import bcrypt from 'bcrypt';
import { UserInfo } from "@src/models/user";


async function findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (!user) throw Error("User is not found");
    return user;
}

async function findUserById(id: number) {
    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });
    if (!user) throw Error("User is not found");
    return user;
}

async function createUser(userDate: UserInfo) {
    try {
        const password_hash = bcrypt.hashSync(userDate.password, 10);
        const user = await prisma.user.create({
            data: {
                name: userDate.name, email: userDate.email,
                password_hash, phone: userDate.phone,
                role: userDate.role
            }
        })
        return user;
    } catch (err) {
        console.log('Error in creating user account');
        throw Error('Error in creating user account');
    }
}



export { findUserByEmail, findUserById, createUser };