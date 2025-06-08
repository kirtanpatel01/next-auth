import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { Habit } from '@/models/habits';

export async function PUT(req: NextRequest) {
  const habitid = req.nextUrl.pathname.split('/').pop(); // or use regex
  const body = await req.json();

  await connectToDB();
  try {
    const updatedHabit = await Habit.findByIdAndUpdate(habitid, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedHabit) return NextResponse.json({ message: 'Habit not found' }, { status: 404 });
    return NextResponse.json({ habit: updatedHabit });
  } catch {
    return NextResponse.json({ message: 'Error updating habit' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const habitid = req.nextUrl.pathname.split('/').pop(); // get dynamic [habitid]

  await connectToDB();
  try {
    const deletedHabit = await Habit.findByIdAndDelete(habitid);
    if (!deletedHabit) return NextResponse.json({ message: 'Habit not found' }, { status: 404 });
    return NextResponse.json({ message: 'habit deleted' });
  } catch {
    return NextResponse.json({ message: 'Error deleting habit' }, { status: 400 });
  }
}
