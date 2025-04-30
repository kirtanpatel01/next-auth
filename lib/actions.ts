"use server"

import { signIn, signOut } from "@/auth"
import { User, RegisterSchemaType } from "../models/user"
import { connectToDB } from "./mongoose"
import bcrypt from 'bcryptjs';
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: '/' })
}

export async function loginAction(formData: FormData) {
  try {
    await signIn('credentials', formData);
    return { success: true };
  } catch (err: any) {
    // Suppress NEXT_REDIRECT message
    if (err?.message === 'NEXT_REDIRECT') {
      return { success: true };
    }
    return { error: err.message || 'Login failed' };
  }
}

export async function logoutAction() {
  await signOut()
}

export async function registerUser(formData: RegisterSchemaType) {
  try {
    const { fullName, username, email, phone, password } = formData;

    await connectToDB();

    const existedUser = await User.findOne({
      $or: [{ email }, { phone }, { username }],
    });

    if (existedUser) {
      return {
        status: 409,
        message: "User already exists!",
        data: null,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      fullName,
      username,
      email,
      phone,
      password: hashedPassword,
    });

    if (!user) {
      return {
        status: 500,
        message: "Error while registering user!",
        data: null,
      };
    }

    return {
      status: 201,
      message: "User registered successfully!",
      data: {
        _id: user._id.toString(),
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    };
  } catch (error) {
    console.error("Register Error:", error);
    return {
      status: 500,
      message: "Something went wrong on the server.",
      data: null,
    };
  }
}