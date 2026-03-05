import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { adminApi } from '@/features/admin/api';
import { useTranslation } from 'react-i18next';

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateUserModal({ open, onOpenChange, onSuccess }: CreateUserModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerSchema = z.object({
    username: z.string().min(3, t('auth.usernameMin')),
    email: z.string().email(t('auth.emailInvalid')),
    phone: z.string().min(1, t('auth.phoneRequired')),
    birth_date: z.string().min(1, t('auth.phoneRequired')), // Reusing phone required for simple date check or add one
    password: z.string().min(6, t('auth.passwordMin')),
  });

  type FormValues = z.infer<typeof registerSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      birth_date: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await adminApi.createUser(data);
      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to create user:', error);
      // Basic error handling for duplicate emails/usernames from backend
      if (error.response?.data?.details) {
        const details = error.response.data.details;
        Object.keys(details).forEach(key => {
          form.setError(key as any, { type: 'manual', message: details[key][0] });
        });
      } else {
        alert(t('auth.registrationFailed'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) form.reset();
      onOpenChange(val);
    }}>
      <DialogContent className="sm:max-w-[500px] border-border bg-card shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-semibold">{t('admin.createNewUser')}</DialogTitle>
          <DialogDescription className="text-[13px]">
            {t('admin.addCollaboratorDesc')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px]">{t("auth.phone")}</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 234 567 890" className="bg-secondary/30 border-border text-[13px]" {...field} />
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
                      <Input type="date" className="bg-secondary/30 border-border text-[13px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px]">{t('admin.initialPassword')}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" className="bg-secondary/30 border-border text-[13px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="text-[13px] border-border"
              >
                {t('common.cancel')}
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className={cn(
                  "min-w-[100px] text-[13px]",
                  "bg-linear-to-br from-indigo-500 to-violet-600 text-white",
                  "hover:brightness-110 hover:shadow-[0_0_0_3px_var(--accent-glow)]",
                  "transition-all duration-150"
                )}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                   t('admin.createUser')
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
