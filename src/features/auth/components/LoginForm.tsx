import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Link } from "react-router-dom"

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
import { Card, CardContent } from "@/components/ui/card"
import axios from "axios"

const loginSchema = z.object({
  username: z.string().min(1, {
    message: "Username or email is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(values: LoginFormValues) {
    try {
      const response = await axios.post("http://localhost:8000/account/token/", {
        "email": values.username,
        "password": values.password
      })
      console.log("Login submitted:", response.data)
      onSuccess()
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  return (
    <Card className="shadow-xl shadow-black/5 border-border bg-card/60 backdrop-blur-md rounded-2xl relative z-10 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username or email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link to="#" className="text-sm font-medium text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
              Log In
            </Button>
            
          </form>
        </Form>
        <div className="text-center mt-6">
          <Link to="/register" className="text-sm font-medium text-primary hover:underline">
            Don't have an account? Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
