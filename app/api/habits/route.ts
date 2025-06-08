import { connectToDB } from "@/lib/mongoose";
import { Habit } from "@/models/habits";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { userId, title } = await req.json();
    if (!userId) {
      return NextResponse.json({ message: "User ID is required!" }, { status: 400 });
    }
    const habit = await Habit.create({ userId, title })
    if(!habit) {
      return NextResponse.json({ message: "Error while creating habit!" }, { status: 500 })
    } 
    return NextResponse.json(
      { message: "Habits saved", data: { habit } }, 
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ message: "User id required!" }, { status: 400 });
    }
    const userId = new mongoose.Types.ObjectId(id);

    const habits = await Habit.find({ userId })
    if (!habits) {
      return NextResponse.json({ message: "No habits found!" }, { status: 404 })
    }

    return NextResponse.json({ message: "Habits fetched successfully.", data: { habits } }, { status: 201 })

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 })
  }
}