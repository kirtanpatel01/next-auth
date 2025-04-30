// app\auth\register\page.tsx

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { registerUser } from "@/lib/actions"
import { RegisterSchemaType } from "../../../models/user"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  username: z.string().min(1, "Username is required").toLowerCase(),
  phone: z.string().min(10, "Phone must be 10 digits").max(10, "Phone must be 10 digits"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters").max(16),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export default function Page() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      username: '',
      phone: '',
      email: "",
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData: RegisterSchemaType = {
      fullName: values.fullName,
      username: values.username,
      email: values.email,
      phone: values.phone,
      password: values.password,
    }

    try {
      const res = await registerUser(formData);
  
      if (res.status === 201) {
        console.log("Success:", res.message);
        toast.success(res.message);
        router.push('/auth/login');
      } else {
        console.warn("Error:", res.message);
        toast.error(res.message)
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Unexpected error");
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-20">
      <Breadcrumb className="absolute top-4 left-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Register</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="max-w-96 w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Register Page</CardTitle>
          <CardDescription>Start your journey with me!</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Write a username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Choose strong password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Re-enter above password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="cursor-pointer w-full">Regsiter</Button>
            </form>
          </Form>

          <div className="text-center text-sm my-4">
            Already have an account ?{" "}
            <Link className="underline underline-offset-2 text-primary" href={'/auth/login'}>Login</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}