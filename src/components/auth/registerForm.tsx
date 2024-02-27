"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/lib/trpc/client/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  FormField,
  FormItem,
  Form,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Loader2 } from "lucide-react";
import { ZodError, z } from "zod";
import Link from "next/link";

const formSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters long.",
    }),
    confirm: z.string().min(8),
    companyName: z.string().min(1),
    lastName: z.string().min(1),
    firstName: z.string().min(1),
  })
  .refine(({ password, confirm }) => password === confirm, {
    message: "Password don't match",
    path: ["confirm"],
  });

type TformSchema = z.infer<typeof formSchema>;

const RegisterForm = () => {
  const router = useRouter();

  const form = useForm<TformSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "dennisloh95@gmail.com",
      password: "",
      confirm: "",
      companyName: "Company A",
      lastName: "Loh",
      firstName: "Dennis",
    },
  });

  const { mutate: register, isPending } =
    trpc.authRouter.userRegister.useMutation({
      onSuccess: async ({ sentToEmail }) => {
        toast.success(`
      Verification email sent to ${sentToEmail}`);
        router.push(`/login`);
        return;
      },
      onError: (err) => {
        if (err.data?.code === "CONFLICT") {
          toast.error("This email is already in use. Sign in instead?");
          return;
        }
        if (err instanceof ZodError) {
          toast.error(err.issues[0].message);
          return;
        }
        toast.error("Something went wrong. Please try again.");
      },
    });

  const onSubmit = async ({
    email,
    password,
    companyName,
    firstName,
    lastName,
  }: TformSchema) => {
    register({ email, password, companyName, firstName, lastName });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[400px] p-3">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you&apos;re
              done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/login">
              Already have an account? <span className="underline">Login</span>
            </Link>
            <div className="space-y-1">
              <Label htmlFor="email">Company Name</Label>
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Last Name</Label>
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">First Name</Label>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Confirm Password</Label>
              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled={isPending} type="submit">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default RegisterForm;
