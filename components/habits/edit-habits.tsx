import { Habit } from '@/types/next-auth-d'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Dot, Plus, Save, X } from 'lucide-react'
import { Input } from '../ui/input'
import axios from 'axios'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

function EditHabits({ 
  habits,
  setHabits 
}: { 
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}) {
  const [editableHabits, setEditableHabits] = useState<Habit[]>(habits);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const { data: session } = useSession();
  const userId = session?.user._id;

  useEffect(() => {
    setEditableHabits(habits);
  }, [habits]);

  const handleChange = (index: number, newTitle: string) => {
    const updated = [...editableHabits];
    updated[index].title = newTitle;
    setEditableHabits(updated);
  };

  const handleSave = async (habit: Habit) => {
    try {
      await axios.put(`/api/habits/${habit._id}`, { title: habit.title });
      toast.success("Habit updated!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update habit");
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/habits/${id}`);
      setHabits(prev => prev.filter(h => h._id !== id));
      toast.success("Habit deleted!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete habit");
    }
  };

  const handleAdd = async () => {
    if (!newHabitTitle.trim()) {
      toast.error("Habit title cannot be empty");
      return;
    }

    try {
      const res = await axios.post('/api/habits', {
        userId,
        title: newHabitTitle.trim(),
      });

      const createdHabit = res.data.data.habit;
      setHabits(prev => [...prev, createdHabit]);
      setNewHabitTitle('');
      toast.success("Habit added!");
    } catch (error) {
      console.log(error);
      toast.error("Error while storing habit");
    }
  };

  return (
    <div className='space-y-2'>
      <ol className='space-y-2'>
        {editableHabits.map((habit, index) => (
          <li key={habit._id} className='flex justify-between'>
            <div className='grid grid-cols-[.07fr_1fr] place-items-center gap-2'>
              <span>{index + 1}. </span>
              <Input
                value={habit.title}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            </div>
            <div className='space-x-2'>
              <Button
                variant={'secondary'}
                size={'icon'}
                onClick={() => handleSave(habit)}
                className='cursor-pointer bg-green-500/20'
              >
                <Save className='text-green-500' />
              </Button>
              <Button
                variant={'destructive'}
                size={'icon'}
                onClick={() => handleDelete(habit._id)}
                className='cursor-pointer'
              >
                <X />
              </Button>
            </div>
          </li>
        ))}
      </ol>
      <div className='flex items-center justify-between gap-2'>
        <div className='grid grid-cols-[.07fr_1fr] place-items-center gap-2'>
          <Dot className='-mx-2 text-primary' />
          <Input
            value={newHabitTitle}
            onChange={(e) => setNewHabitTitle(e.target.value)}
            placeholder='Write new habit...'
            className='w-fit'
          />
        </div>
        <Button size={'icon'} className='cursor-pointer' onClick={handleAdd}>
          <Plus />
        </Button>
      </div>
    </div>
  )
}

export default EditHabits