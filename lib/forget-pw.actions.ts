'use server'

import { OTP } from "@/models/otp";

export async function verifyOtp(email: string, otp: string) {
    const dbOtp = await OTP.findOne({ email });
    if(!dbOtp) {
        return {
            status: 404,
            msg: 'OTP not found',
        }
    }

    const now = new Date();

    if(!dbOtp.used) {
        return {
            status: 400,
            msg: 'OTP has already been used',
        }
    }

    if(dbOtp.expiresAt < now) {
        return {
            status: 400,
            msg: 'OTP has expired',
        }
    }

    if(dbOtp.code !== otp) {
        return {
            status: 400,
            msg: 'Invalid OTP',
        }
    }

    dbOtp.used = true;
    await dbOtp.save();

    return {
        status: 200,
        msg: 'OTP verified successfully.'
    }
}