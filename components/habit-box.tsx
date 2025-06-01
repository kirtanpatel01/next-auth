'use client'

import React from 'react'
import { FaFire } from "react-icons/fa6";
import { Checkbox } from './ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from './ui/separator';
import { Card, CardContent, CardHeader } from './ui/card';

const checks = [
    {
        slug: "drink-water",
        title: "Drink Water"
    },
    {
        slug: "night-walk",
        title: "Night Walk"
    },
    {
        slug: "morning-exercise",
        title: "Morning Exercise"
    },
    {
        slug: "evening-exercise",
        title: "Evening Exercise"
    },
]

const FormSchema = z.object({
    items: z.array(z.string())
})

export default function HabitBox() {
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
                                    {checks.map((check) => (
                                        <FormField
                                            key={check.slug}
                                            control={form.control}
                                            name="items"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={check.slug}
                                                        className='flex items-center gap-4'
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(check.slug)}
                                                                onCheckedChange={(checked) => {
                                                                    onChange(check.slug)
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
                                                        <FormLabel className={`${field.value?.includes(check.slug) ? "line-through opacity-80" : ""}`}>{check.title}</FormLabel>
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}