import { connectToDB } from "@/lib/mongoose";
import { User } from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const formData = await req.json();
        const { fullName, username, email, phone, password } = formData;

        await connectToDB();

        const existedUser = await User.findOne({
            $or: [{ email }, { phone }, { username }],
        });

        if (existedUser) {
            return Response.json({ message: "User already exists!" }, { status: 409 });
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
            return Response.json({ message: "Error while registering user!" }, { status: 500 });
        }

        return Response.json({
            message: "User registered successfully",
            data: {
                _id: user._id.toString(),
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                phone: user.phone,
            }
        }, { status: 201 });
    } catch (error) {
        console.log(error);
        return Response.json({ message: "Something went wrong!" }, { status: 500 });
    }
}