"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button, buttonVariants } from "@/components/ui/button"
import ErrorBanner from "@/components/ui/error-banner"
import { Form } from "@/components/ui/form"
import FormInput from "@/components/ui/form-input"
import Logo from "@/components/ui/logo"

import { cn } from "@/lib/utils"
import { LoginSchema, LoginType } from "@/lib/validators/login"

const LoginForm = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const router = useRouter()

  const form = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  const onSubmit = async (values: LoginType) => {
    try {
      setLoading(true)

      await signIn("credentials", {
        redirect: false,
        identifier: values.identifier,
        password: values.password,
      })

      router.push("/")
      router.refresh()
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
        <h2 className="text-2xl font-bold tracking-tighter">Sign In</h2>
        <p className="text-sm text-muted-foreground">
          Login to keep track and discuss your favorite anime and manga
        </p>
      </div>

      {error && <ErrorBanner message={error} />}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <FormInput
            name="identifier"
            control={form.control}
            label="Email or Username"
            loading={loading}
          />

          <FormInput
            name="password"
            control={form.control}
            label="Password"
            type="password"
            loading={loading}
          />

          <Button
            type="submit"
            disabled={loading}
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
