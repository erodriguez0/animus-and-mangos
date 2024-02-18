"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button, buttonVariants } from "@/components/ui/button"
import ErrorBanner from "@/components/ui/error-banner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Logo from "@/components/ui/logo"

import { cn } from "@/lib/utils"
import { RegisterSchema, RegisterType } from "@/lib/validators/register"

const RegisterForm = () => {
  const [loading, setLoading] = useState<boolean>(false)
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
      setLoading(true)

      const res = await fetch("/api/auth/register", {
        method: "post",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        const message = await res.json()
        setError(message)
        return
      }

      router.push("/login")
    } catch (error) {
      setError("Something went wrong, please try again later")
    } finally {
      setLoading(false)
    }
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

      {error && <ErrorBanner message={error} />}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="confirm"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={loading}
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
