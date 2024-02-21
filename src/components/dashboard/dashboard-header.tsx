import Link from "next/link"

import Header from "@/components/ui/header"
import Logo from "@/components/ui/logo"

import DashboardDrawer from "@/components/dashboard/dashboard-drawer"

const DashboardHeader = () => {
  return (
    <Header className="lg:hidden">
      <div className="flex h-full items-center">
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <div className="ml-auto flex h-full items-center justify-end">
        <div className="flex gap-2">
          <DashboardDrawer />
        </div>
      </div>
    </Header>
  )
}

export default DashboardHeader
