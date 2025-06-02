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

const checks = [
    {
        id: uuidv4(),
        slug: "drink-water",
        title: "Drink Water"
    },
    {
        id: uuidv4(),
        slug: "night-walk",
        title: "Night Walk"
    },
    {
        id: uuidv4(),
        slug: "morning-exercise",
        title: "Morning Exercise"
    },
    {
        id: uuidv4(),
        slug: "evening-exercise",
        title: "Evening Exercise"
    },
]

const habitSchema = z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string().min(1, "Title cannot be empty"),
})

const FormSchema = z.object({
    items: z.array(z.string())
})

export default function HabitBox() {
    const [editMode, setEditMode] = useState(false);
    const [habits, setHabits] = useState(checks);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            items: [],
        },
    })

    const onChange = (slug: string) => {
        console.log(slug);
    }

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
                <Form {...form}>
                    <form className='space-y-6'>
                        <FormField
                            control={form.control}
                            name="items"
                            render={() => (
                                <FormItem>
                                    {habits.map((check) => (
                                        <FormField
                                            key={check.id}
                                            control={form.control}
                                            name="items"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={check.id}
                                                        className='flex items-center gap-4'
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(check.slug)}
                                                                onCheckedChange={(checked) => {
                                                                    onChange(check.slug);
                                                                    return checked
                                                                        ? field.onChange([...field.value, check.slug])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== check.slug
                                                                            )
                                                                        )
                                                                }}
                                                                className='size-7'
                                                            />
                                                        </FormControl>
                                                        {editMode ? (
                                                            <Input
                                                                value={check.title}
                                                                onChange={(e) => {
                                                                    const newTitle = e.target.value;
                                                                    const slug = slugify(newTitle);
                                                                    console.log(newTitle, slug);
                                                                    const updated = habits.map(habit =>
                                                                        habit.id === check.id
                                                                            ? {
                                                                                ...habit,
                                                                                title: newTitle,
                                                                                slug: slug || uuidv4(),
                                                                            }
                                                                            : habit
                                                                    );
                                                                    setHabits(updated);
                                                                }}
                                                            />
                                                        ) : (
                                                            <FormLabel
                                                                className={`${field.value?.includes(check.slug) ? "line-through opacity-80" : ""}`}
                                                            >
                                                                {check.title}
                                                            </FormLabel>
                                                        )}

                                                        {editMode && (
                                                            <Button
                                                                type='button'
                                                                size='icon'
                                                                variant='destructive'
                                                                className='cursor-pointer'
                                                                onClick={() => setHabits(habits.filter(h => h.slug !== check.slug))}
                                                            >
                                                                <X />
                                                            </Button>
                                                        )}
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                    {editMode && (
                                        <Button
                                            onClick={() => {
                                                const newHabit = {
                                                    id: uuidv4(),
                                                    slug: "",
                                                    title: ""
                                                }
                                                setHabits([...habits, newHabit]);
                                            }}
                                            type='button'
                                            variant='secondary'
                                            className='w-fit cursor-pointer my-2'>
                                            <Plus />
                                            New
                                        </Button>
                                    )}
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </CardContent>
            <Separator />
            <CardFooter>
                <Button
                    onClick={() => {
                        form.trigger();
                        setEditMode(!editMode)
                    }}
                    className='flex ml-auto cursor-pointer'>
                    <span>{editMode ? "Save" : "Edit"}</span>
                    {editMode ? <Save /> : <Edit />}
                </Button>
            </CardFooter>
        </Card>
    )
}