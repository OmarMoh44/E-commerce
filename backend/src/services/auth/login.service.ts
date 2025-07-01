import { findUserByEmail } from "@services/prisma/user.service";
import bcrypt from 'bcrypt';

async function verifyLogin(email: string, password: string) {
    try {
        const user = await findUserByEmail(email);
        checkPassword(password, user.password_hash);
        return user;
    } catch (error: any) {
        console.log(error.message);
        throw error;
    }
}

function checkPassword(password: string, hashedPassword: string) {
    if (!bcrypt.compareSync(password, hashedPassword))
        throw Error("Password is not correct");
}


export { verifyLogin };