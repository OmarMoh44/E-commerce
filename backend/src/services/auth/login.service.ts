import { findUserByEmail } from "@services/prisma/user.service";
import bcrypt from 'bcrypt';
import { GraphQLError } from "graphql";

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
        throw new GraphQLError('Password is not correct', {
            extensions: { code: 'BAD_USER_INPUT' }
        })
}


export { verifyLogin, checkPassword };