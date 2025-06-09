import { connectToDB } from "@/lib/mongoose";
import { Habit } from "@/models/habits";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { secret } = await req.json();

  if(secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    await connectToDB();

    await Habit.updateMany(
      {},
      { $set: { isCompleted: false } }
    )

    return NextResponse.json({ message: 'All users habits reset successfully' }, { status: 200 })
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to reset habits' }, { status: 500 })
  }
}
