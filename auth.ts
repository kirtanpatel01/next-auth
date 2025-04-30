export const runtime = "nodejs";

import NextAuth from "next-auth"
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { User } from "./models/user";
import { connectToDB } from "./lib/mongoose";
import bcrypt from "bcryptjs";
// import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google,
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                // console.log(credential.email);
                const email = credentials?.email;
                const password = credentials?.password;

                if (!email || !password) {
                    throw new Error('Email or Password not provided!')
                }

                try {
                    await connectToDB();
                    const user = await User.findOne({ email });
                    if (!user) {
                        throw new Error('User not found for this email address!')
                    }
                    if (typeof password !== 'string') {
                        throw new Error('Stored password is not a valid string');
                    }

                    const isValid = await bcrypt.compare(password, user.password);
                    if(!isValid) {
                        throw new Error('Password not match');
                    }

                    console.log(user);
                    return {
                        id: user._id.toString(),
                        email: user.email,
                    }
                } catch (error) {
                    throw error
                }
            }
        })
    ],
})