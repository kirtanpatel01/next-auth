// types/next-auth.d.ts or just next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      _id?: string
    } & DefaultSession["user"]
  }

  interface User {
    _id?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string
  }
}

export interface Habit {
  _id: string;
  title: string;
  isCompleted: boolean;
};

export interface FormSchema {
  items: string[];
};

