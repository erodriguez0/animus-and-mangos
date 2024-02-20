interface ErrorBannerProps {
  message: string
}

const ErrorBanner = ({ message }: ErrorBannerProps) => {
  return (
    <div className="flex min-h-10 w-full flex-wrap items-center break-all rounded-md bg-destructive px-4 py-2">
      <p className="text-sm text-destructive-foreground">{message}</p>
    </div>
  )
}

export default ErrorBanner
