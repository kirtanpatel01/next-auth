'use client'

import React, { useState } from 'react'
import { FaFire } from "react-icons/fa6";
import { Checkbox } from './ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from './ui/separator';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Edit, Plus, Save, X } from 'lucide-react';
import { Input } from './ui/input';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';

const FormSchema = z.object({
  items: z.array(z.string())
})

export default function HabitBox() {
  const [editMode, setEditMode] = useState(false)
  type Habit = { id: string; slug: string; title: string }
  const [habits, setHabits] = useState<Habit[]>([])

  console.log(habits);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { items: [] },
  })

  return (
    <Card className='min-w-96'>
      <CardHeader className="flex justify-between items-center text-2xl font-medium">
        <span>Friday 20, 2025</span>
        <div className='flex items-center gap-1 p-2 rounded-2xl'>
          <FaFire className='text-orange-500' />
          <span>6</span>
        </div>
      </CardHeader>
      <Separator />
      <CardContent>
        {habits.length === 0 && !editMode
          ? (
            <div className='flex flex-col'>
              <span className='text-lg font-semibold tracking-wider'>No habits!</span>
              <span className='opacity-50'>Click on edit buttton to add new habits</span>
            </div>
          ) : (
            <Form {...form}>
              <form className='space-y-6'>
                <FormField
                  control={form.control}
                  name="items"
                  render={({ field }) => (
                    <FormItem>
                      {habits.map((habit) => (
                        <FormItem key={habit.id} className='flex items-center gap-4'>
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(habit.slug)}
                              onCheckedChange={(checked) =>
                                checked
                                  ? field.onChange([...field.value, habit.slug])
                                  : field.onChange(field.value?.filter(v => v !== habit.slug))
                              }
                              className='size-7'
                            />
                          </FormControl>
                          {editMode ? (
                            <Input
                              value={habit.title}
                              onChange={(e) => {
                                const newTitle = e.target.value
                                const slug = slugify(newTitle) || uuidv4()
                                setHabits(habits.map(h =>
                                  h.id === habit.id ? { ...h, title: newTitle, slug } : h
                                ))
                              }}
                            />
                          ) : (
                            <FormLabel className={field.value?.includes(habit.slug) ? "line-through decoration-2 opacity-60" : ""}>
                              {habit.title}
                            </FormLabel>
                          )}
                          {editMode && (
                            <Button
                              type='button'
                              size='icon'
                              variant='destructive'
                              className='cursor-pointer '
                              onClick={() => setHabits(habits.filter(h => h.slug !== habit.slug))}
                            >
                              <X />
                            </Button>
                          )}
                        </FormItem>
                      ))}
                      {editMode && (
                        <Button
                          type='button'
                          variant='secondary'
                          className='w-fit cursor-pointer my-2'
                          onClick={() => setHabits([...habits, { id: uuidv4(), slug: "", title: "" }])}
                        >
                          <Plus />
                          New
                        </Button>
                      )}
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}
      </CardContent>
      <Separator />
      <CardFooter>
        <Button
          onClick={() => {
            if (editMode) {
              // On save, remove empty habit tasks
              const filteredHabits = habits.filter(habit => habit.title.trim() !== "")
              setHabits(filteredHabits)
            }
            setEditMode(!editMode)
          }}
          className='flex ml-auto cursor-pointer'
        >
          <span>{editMode ? "Save" : "Edit"}</span>
          {editMode ? <Save /> : <Edit />}
        </Button>
      </CardFooter>
    </Card>
  )
}
