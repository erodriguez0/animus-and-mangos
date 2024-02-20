"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useTransition } from "react"
import { useFormState } from "react-dom"
import { useForm } from "react-hook-form"

import { Button, buttonVariants } from "@/components/ui/button"
import ErrorBanner from "@/components/ui/error-banner"
import { Form } from "@/components/ui/form"
import FormInput from "@/components/ui/form-input"
import Logo from "@/components/ui/logo"

import { RegisterSchema, RegisterType } from "@/lib/validators/register"

import { cn } from "@/lib/utils"

import { createUser } from "@/actions/create-user"

const RegisterForm = () => {
  const [state, action] = useFormState(createUser, { message: "" })
  const [isPending, startTransition] = useTransition()

  const form = useForm<RegisterType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm: "",
    },
  })

  const onSubmit = async (values: RegisterType) => {
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
        <h2 className="text-2xl font-bold tracking-tighter">Sign Up</h2>
        <p className="text-sm text-muted-foreground">
          Register to keep track and discuss your favorite anime and manga
        </p>
      </div>

      {state.message && <ErrorBanner message={state.message} />}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <FormInput
            name="email"
            control={form.control}
            disabled={isPending}
            type="text"
          />

          <FormInput
            name="password"
            type="password"
            control={form.control}
            disabled={isPending}
          />

          <FormInput
            name="confirm"
            type="password"
            control={form.control}
            disabled={isPending}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="lg:w-fit"
          >
            Create Account
          </Button>
        </form>
      </Form>

      <div>
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "link" }),
            "p-0 text-foreground",
          )}
        >
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  )
}

export default RegisterForm
