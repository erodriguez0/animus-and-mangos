import { ReactNode } from "react"

import SiteHeader from "@/components/site/site-header"

interface CharacterDetailsLayoutProps {
  children: ReactNode
}

const CharacterDetailsLayout = ({ children }: CharacterDetailsLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container mx-auto flex min-h-[calc(100vh-4rem)] gap-2 lg:min-h-[calc(100vh-5rem)] lg:px-2 xl:gap-4 xl:px-0">
        <div className="flex flex-1 flex-col gap-4 overflow-x-hidden">
          {children}
          {/* Bottom padding to maintain py-0 on parent */}
          <div />
        </div>
      </main>
    </div>
  )
}

export default CharacterDetailsLayout
