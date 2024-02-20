"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useState, useTransition } from "react"
import { useFormState } from "react-dom"
import { useForm } from "react-hook-form"

import { Button, buttonVariants } from "@/components/ui/button"
import ErrorBanner from "@/components/ui/error-banner"
import { Form } from "@/components/ui/form"
import FormInput from "@/components/ui/form-input"
import Logo from "@/components/ui/logo"

import { LoginSchema, LoginType } from "@/lib/validators/login"

import { cn } from "@/lib/utils"

import { loginUser } from "@/actions/login-user"

const LoginForm = () => {
  const [state, action] = useFormState(loginUser, { message: "" })
  const [isPending, startTransition] = useTransition()

  const form = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  const onSubmit = async (values: LoginType) => {
    startTransition(async () => {
      action(values)
    })
  }

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-4 border bg-background p-8">
      <Link
        href="/"
        className="w-fit"
      >
        <Logo />
      </Link>

      <div className="flex flex-col">
        <h2 className="text-2xl font-bold tracking-tighter">Sign In</h2>
        <p className="text-sm text-muted-foreground">
          Login to keep track and discuss your favorite anime and manga
        </p>
      </div>

      {state?.message && <ErrorBanner message={state.message} />}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <FormInput
            name="identifier"
            control={form.control}
            label="Email or Username"
            disabled={isPending}
          />

          <FormInput
            name="password"
            control={form.control}
            label="Password"
            type="password"
            disabled={isPending}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="lg:w-fit"
          >
            Sign In
          </Button>
        </form>
      </Form>

      <div>
        <Link
          href="/register"
          className={cn(
            buttonVariants({ variant: "link" }),
            "p-0 text-foreground",
          )}
        >
          {"Don't have an account? Sign up"}
        </Link>
      </div>
    </div>
  )
}

export default LoginForm
