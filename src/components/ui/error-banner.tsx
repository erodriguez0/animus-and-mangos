interface ErrorBannerProps {
  message: string
}

const ErrorBanner = ({ message }: ErrorBannerProps) => {
  return (
    <div className="flex h-10 w-full items-center rounded-md bg-destructive px-4">
      <p className="text-sm text-destructive-foreground">{message}</p>
    </div>
  )
}

export default ErrorBanner
