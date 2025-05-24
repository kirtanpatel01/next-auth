import { User } from '@/models/user';
import { hash } from 'bcryptjs'; // or your preferred hasher

export async function POST(req: Request) {
    try {
        const { email, newPassword } = await req.json();
        const hashed = await hash(newPassword, 12);
        const user = await User.findOneAndUpdate(
            { email },
            { password: hashed },
            { new: true }
        );
        if(!user) {
            return Response.json({ error: "Failed to reset password" }, { status: 500 })
        }
        return Response.json({ message: 'Password reset' });
    } catch (err) {
        console.log(err);
        return Response.json({ error: 'Failed to reset password' }, { status: 500 });
    }
}
