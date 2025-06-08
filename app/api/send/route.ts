// app\api\send\route.ts

import EmailTemplate from '@/components/email-template';
import { Resend } from 'resend';
import { sign } from 'jsonwebtoken';
import { auth } from '@/auth';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
    try {
        const session = await auth();
        const email = session?.user?.email || "";
        const name = session?.user?.name || "";
        
        const token = sign({ email }, process.env.JWT_SECRET!, { expiresIn: "15m" })
        const resetUrl = `https://next-auth-five-ruby.vercel.app/reset?token=${token}`;

        const { data, error } = await resend.emails.send({
            from: 'Kiton <onboarding@resend.dev>',
            to: [email],
            subject: 'Reset your kiton account password',
            react: EmailTemplate({ firstName: name }, {resetUrl}),
        });
        
        if (error) {
            console.log(error);
            return Response.json({ error }, { status: 500 });
        }

        return Response.json(data);
    } catch (error) {
        console.log(error);
        return Response.json({ error }, { status: 500 });
    }
}