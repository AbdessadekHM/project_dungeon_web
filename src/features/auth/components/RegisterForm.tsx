import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Link } from "react-router-dom"
import {toast} from "sonner"
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

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(5, "Phone number is required."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string().min(6, "Confirm password is required."),
  birth_date: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onSuccess: () => void;
}

import { useTranslation } from "react-i18next"

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { t } = useTranslation()

  const registerSchema = z.object({
    username: z.string().min(3, t("auth.usernameMin")),
    email: z.string().email(t("auth.emailInvalid")),
    phone: z.string().min(5, t("auth.phoneRequired")),
    password: z.string().min(6, t("auth.passwordMin")),
    confirmPassword: z.string().min(6, t("auth.confirmPasswordRequired")),
    birth_date: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t("auth.passwordsMatch"),
    path: ["confirmPassword"],
  })

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      birth_date: new Date().toISOString(),
    },
  })
  
  async function onSubmit(values: RegisterFormValues) {
    const {confirmPassword, ...data} = values

    try{
      await axios.post(import.meta.env.VITE_API_URL + "/account/register/", data)
      toast.success(t("auth.registrationSuccessful"))
      onSuccess()
    } catch (error) {
      toast.error(t("auth.registrationFailed"))
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
                  <FormLabel className="text-[13px]">{t("auth.username")}</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" className="bg-secondary/30 border-border text-[13px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px]">{t("auth.email")}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" className="bg-secondary/30 border-border text-[13px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px]">{t("auth.phone")}</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" className="bg-secondary/30 border-border text-[13px]" {...field} />
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
                  <FormLabel className="text-[13px]">{t("auth.password")}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" className="bg-secondary/30 border-border text-[13px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px]">{t("auth.confirmPassword")}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" className="bg-secondary/30 border-border text-[13px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birth_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px]">{t("auth.birthDate")}</FormLabel>
                  <FormControl>
                    <Input type="date" placeholder={t("auth.birthDate")} className="bg-secondary/30 border-border text-[13px]" {...field}  />
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
            >
              {form.formState.isSubmitting ? t("auth.registering") : t("auth.createAccount")}
            </Button>
          </form>
        </Form>
        
        <div className="text-center mt-6">
          <Link to="/login" className="text-[13px] font-medium text-primary hover:underline">
            {t("auth.alreadyHaveAccount")} {t("auth.logIn")}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
