"use client";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type RegisterSchema, registerSchema } from "../schemas";
import { useRegister } from "../api/use-register";
import { signUpWithGithub } from "@/lib/oauth";
import { Eye, EyeOff } from "lucide-react";

export const SignUpCard = () => {
  const { mutate, isPending } = useRegister();
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (values: RegisterSchema) => {
    mutate({ json: values });
  };
  return (
    <Card className="size-full border-none bg-slate-200 shadow-none dark:bg-zinc-800 md:w-[487px]">
      <CardHeader className="flexx items-center justify-center px-4 py-8 text-center">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription className="dark:text-slate-10 text-[12px] text-slate-900 dark:text-slate-200">
          By signing up, you agree to our <br />
          <Link href="/privacy">
            <span className="text-gray-400 underline underline-offset-2">
              Privacy Policy
            </span>
          </Link>{" "}
          and{" "}
          <Link href="/terms">
            <span className="text-gray-400 underline underline-offset-2">
              terms
            </span>
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-1">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto w-3/4 space-y-4"
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your name"
                      className="border border-zinc-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter email address"
                      className="border border-zinc-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="border border-zinc-600"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" size="lg" disabled={isPending}>
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="hidden px-7">
        <DottedSeparator />
      </div>
      <CardContent className="hidden flex-col gap-y-2 p-7">
        <Button
          onClick={() => signUpWithGithub()}
          disabled={isPending}
          variant="secondary"
          size="lg"
          className="w-full border border-zinc-600"
        >
          <FaGithub className="mr-2 size-5" />
          Login with Github
        </Button>
      </CardContent>
      <CardContent className="flex items-center justify-center p-4 text-sm">
        <p>
          already have an account?
          <Link href="/sign-in">
            <span className="text-[#71c1ff] hover:underline hover:underline-offset-2">
              &nbsp;Sign In
            </span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
