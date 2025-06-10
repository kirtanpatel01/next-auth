import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { Checkbox } from '../ui/checkbox'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Habit } from '@/types/next-auth-d'
import axios from 'axios'

const FormSchema = z.object({
  items: z.array(z.string())
})

function ShowHabits({ habits } : { habits: Habit[] }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { items: habits.filter(h => h.isCompleted).map(h => h._id) },
  })

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name='items'
        render={() => (
          <FormItem>
            {habits.map((habit) => (
              <FormField
                key={habit._id}
                control={form.control}
                name='items'
                render={({ field }) => {
                  return (
                    <FormItem
                      key={habit._id}
                      className='flex flex-row items-center gap-2'
                    >
                      <FormControl>
                        <Checkbox
                          className='size-6 cursor-pointer'
                          checked={field.value?.includes(habit._id)}
                          // defaultChecked={habit.isCompleted}
                          onCheckedChange={async (checked) => {
                            if(checked) {
                              await axios.post('/api/habits/complete', { _id: habit._id })
                            } else {
                              await axios.post('/api/habits/incomplete', { _id: habit._id })
                            }
                            return checked
                              ? field.onChange([...field.value, habit._id])
                              : field.onChange(
                                field.value?.filter(
                                  (value) => value !== habit._id
                                )
                              )
                          }}
                        />
                      </FormControl>
                      <FormLabel className='cursor-pointer'>
                        {habit.title}
                      </FormLabel>
                    </FormItem>
                  )
                }}
              />
            ))}
          </FormItem>
        )}
      />
    </Form>
  )
}

export default ShowHabits