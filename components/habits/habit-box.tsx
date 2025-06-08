'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from "next-auth/react";
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { FaFire } from "react-icons/fa6";
import { Edit, Save } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import ShowHabits from './show-habits';
import EditHabits from './edit-habits';

export default function HabitBox() {
  const [editMode, setEditMode] = useState(false)
  const [habits, setHabits] = useState<{ _id: string; title: string }[]>([])
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHabits = async () => {
      if (!session) return;
      const id = session?.user._id;
      try {
        const res = await axios.get(`/api/habits?id=${id}`)
        setHabits(res.data.data.habits);
        console.log(habits);
      } catch (error) {
        toast.error("Error while fetching habits")
        console.log("Error while fetching habits from habit-box.jsx: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHabits()
  }, [session, habits])

  return (
    <Card className='max-w-lg'>
      <CardHeader className="flex justify-between items-center text-2xl font-medium">
        <span>Friday 20, 2025</span>
        <div className='flex items-center gap-1 p-2 rounded-2xl'>
          <FaFire className='text-orange-500' />
          <span>6</span>
        </div>
      </CardHeader>
      <Separator />
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : editMode ? (
          <EditHabits habits={habits} setHabits={setHabits} />
        ) : habits.length > 0 ? (
          <ShowHabits habits={habits} />
        ) : (
          <div>
            <span className='font-medium text-lg'>No Habits!</span>
            <p className='opacity-50'>Click on edit button to add new habits</p>
          </div>
        )}
      </CardContent>
      <Separator />
      <CardFooter>
        <Button type='button' onClick={() => setEditMode(!editMode)} className='flex ml-auto cursor-pointer'>
          <span>{editMode ? "Save" : "Edit"}</span>
          {editMode ? <Save /> : <Edit />}
        </Button>
      </CardFooter>
    </Card>
  )
}
