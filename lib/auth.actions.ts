// lib/actinos.ts

"use server"

import { signIn } from "@/auth"
import { User } from "../models/user"
import { connectToDB } from "./mongoose"

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: '/habits?loggedIn=google' });

}

export async function loginAction(formData: FormData) {
  try {
    await signIn('credentials', formData);
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message === 'NEXT_REDIRECT') {
        return { success: true };
      }
      return { error: err.message || 'Login failed' };
    }

    return { error: 'Login failed due to an unknown error' };
  }
}

export async function fetchUserNameByEmail(email: string) {
  try {
    if (!email) {
      return {
        status: 409,
        message: "Email is required.",
        data: null,
      }
    }

    await connectToDB();
    const user = await User.findOne({ email });
    if (!user) {
      return {
        status: 404,
        message: "User not found.",
        data: null,
      }
    }

    return {
      status: 200,
      message: "Name fetched successfully.",
      data: { name: user?.fullName },
    }

  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Something went wrong on the server.",
      data: null,
    }
  }
}
