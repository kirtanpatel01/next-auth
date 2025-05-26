// app\api\send\route.ts

import EmailTemplate from '@/components/email-template';
import { fetchUserNameByEmail } from '@/lib/auth.actions';
import { Resend } from 'resend';
import { sign } from 'jsonwebtoken';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();
        const res = await fetchUserNameByEmail(email);
        if (res.status == 404) {
            return Response.json({ error: res.message }, { status: res.status })
        }
        let name = '';

        if (res.status === 200) {
            name = res.data?.name;
        } else {
            return Response.json({ error: res.message }, { status: res.status })
        }
        const token = sign({ email }, process.env.JWT_SECRET!, { expiresIn: "15m" })
        const baseUrl =
            process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000'
                : 'https://next-auth-five-ruby.vercel.app';

        const resetUrl = `${baseUrl}/reset?token=${token}`;


        const { data, error } = await resend.emails.send({
            from: 'Kiton <onboarding@resend.dev>',
            to: [email],
            subject: 'Reset your kiton account password',
            react: EmailTemplate({ firstName: name }, { resetUrl }),
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