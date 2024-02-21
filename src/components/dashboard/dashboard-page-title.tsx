interface DashboardPageTitleProps {
  title: string
}

const DashboardPageTitle = ({ title }: DashboardPageTitleProps) => {
  return <h2 className="text-3xl font-bold tracking-tighter">{title}</h2>
}

export default DashboardPageTitle
