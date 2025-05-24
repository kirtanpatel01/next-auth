import { verify } from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        const { token } = await req.json();
        console.log(token);
        const decoded = verify(token, process.env.JWT_SECRET!);
        return Response.json({ email: ( decoded as any).email })
;    } catch (error) {
        return Response.json({ error: 'Invalid or expired token' }, { status: 401 })   
    }
}