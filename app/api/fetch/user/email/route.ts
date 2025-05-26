import { connectToDB } from "@/lib/mongoose";
import { User } from "@/models/user";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();
        if (!email) {
            return Response.json({message: "Email is required."}, {status: 409});
        }
        
        await connectToDB();
        const user = await User.findOne({ email });
        if (!user) {
            return Response.json({message: "User not found!"}, {status: 404});
        }
        
        return Response.json({message: "User not found!", name: user?.fullName}, {status: 201});
    } catch (error) {
        console.log(error);
        return Response.json({message: "Something went wrong"}, {status: 500});
    }
}