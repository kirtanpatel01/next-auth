export const runtime = "nodejs";

import NextAuth from "next-auth"
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { User } from "./models/user";
import { connectToDB } from "./lib/mongoose";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google,
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
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

    callbacks: {
        async signIn({ user, account }) {
            if(account?.provider === 'google') {
                try {
                    await connectToDB();
                    const existingUser = await User.findOne({ email: user.email });

                    if(!existingUser) {
                        await User.create({
                            email: user.email,
                            fullName: user.name,
                        })
                    }
                } catch (error) {
                    console.log("Error saving google user: ", error);
                    return false;
                }
            }
            return true;
        }
    }
})