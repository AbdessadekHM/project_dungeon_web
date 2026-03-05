import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Link } from "react-router-dom"
import { toast } from "sonner"

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
import { cn } from "@/lib/utils"
import axios from "axios"
import { useAuthStore } from "../stores/useAuthStore"

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
      const auth = useAuthStore.getState()
      const response = await axios.post(import.meta.env.VITE_API_URL + "/account/token/", {
        "email": values.username,
        "password": values.password
      })
      const {user, access, refresh} = response.data
      auth.setAuth(user, {access, refresh})
      onSuccess()
    } catch (error: any) {
      console.error("Login failed:", error)
      const message = error.response?.data?.detail 
        || error.response?.data?.error 
        || "Invalid credentials or server error. Please try again."
        
      toast.error('Login Failed', {
        description: message,
      })
    }
  }

  return (
    <Card className="shadow-xl shadow-black/5 border-border bg-card/60 backdrop-blur-md rounded-xl relative z-10 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-0.5">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px]">Username or Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username or email" className="bg-secondary/30 border-border text-[13px]" {...field} />
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
                    <FormLabel className="text-[13px]">Password</FormLabel>
                    <Link to="#" className="text-[12px] font-medium text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" className="bg-secondary/30 border-border text-[13px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className={cn(
                "w-full mt-6 text-[13px]",
                "bg-linear-to-br from-indigo-500 to-violet-600 text-white",
                "hover:brightness-110 hover:shadow-[0_0_0_3px_var(--accent-glow)]",
                "transition-all duration-150"
              )}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Logging in..." : "Log In"}
            </Button>
            
          </form>
        </Form>
        <div className="text-center mt-6">
          <Link to="/register" className="text-[13px] font-medium text-primary hover:underline">
            Don't have an account? Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
