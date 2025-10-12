"use client";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { signUpWithGithub } from "@/lib/oauth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { type LoginSchema, loginSchema } from "../schemas";
import { useLogin } from "../api/use-login";

export const SignInCard = () => {
  const { mutate, isPending } = useLogin();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (values: LoginSchema) => {
    mutate({ json: values });
  };
  return (
    <Card className="size-full border-none bg-neutral-200 shadow-none dark:bg-neutral-900 md:w-[487px]">
      <CardHeader className="flexx items-center justify-center p-7 text-center">
        <CardTitle className="text-2xl">Welcome Back!</CardTitle>
      </CardHeader>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <FormItem className="flex flex-col items-start">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="border border-zinc-600"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
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
                  <Button
                    type="button"
                    variant={"link"}
                    className="-ml-4 text-gray-800 hover:underline"
                  >
                    <Link href="/forgot-password">
                      <span className="cursor-pointer text-sm text-gray-800 dark:text-gray-400 hover:dark:underline">
                        Forgot Password?
                      </span>
                    </Link>
                  </Button>
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              type="submit"
              size="lg"
              disabled={isPending}
            >
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="hidden px-7">
        <Separator />
      </div>
      <CardContent className="hidden flex-col gap-y-4 p-7">
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
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="flex items-center justify-center p-7">
        <p>
          Don&apos;t have an account?
          <Link href="/sign-up">
            <span className="cursor-pointer text-neutral-950 underline-offset-4 hover:underline dark:text-gray-400">
              &nbsp;Signup
            </span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
