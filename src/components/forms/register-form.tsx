"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useFormState } from "react-dom"
import { useForm } from "react-hook-form"

import { Button, buttonVariants } from "@/components/ui/button"
import ErrorBanner from "@/components/ui/error-banner"
import { Form } from "@/components/ui/form"
import FormInput from "@/components/ui/form-input"
import Logo from "@/components/ui/logo"

import { RegisterSchema, RegisterType } from "@/lib/validators/register"

import { cn } from "@/lib/utils"

const RegisterForm = () => {
  const [error, setError] = useState<string>("")
  const router = useRouter()

  const form = useForm<RegisterType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm: "",
    },
  })

  const onSubmit = async (values: RegisterType) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        const message = await res.json()
        setError(message)
      }

      router.replace("/")
      router.refresh()
    } catch (error) {
      setError("Something went wrong, try again later")
    }
  }

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-4 rounded-md border bg-background p-8">
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

      {error && <ErrorBanner message={error} />}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <FormInput
            name="email"
            control={form.control}
            disabled={form.formState.isSubmitting}
            type="text"
          />

          <FormInput
            name="password"
            type="password"
            control={form.control}
            disabled={form.formState.isSubmitting}
          />

          <FormInput
            name="confirm"
            type="password"
            control={form.control}
            disabled={form.formState.isSubmitting}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
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
