import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { Checkbox } from '../ui/checkbox'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Habit } from '@/types/next-auth-d'

const FormSchema = z.object({
  items: z.array(z.string())
})

function ShowHabits({ habits } : { habits: Habit[] }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { items: [] },
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
                          className='size-6'
                          checked={field.value?.includes(habit._id)}
                          onCheckedChange={(checked) => {
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
                      <FormLabel>
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