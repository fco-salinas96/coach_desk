import React from "react"
import { CoachSidebar } from '@/components/coach/sidebar'

export default function CoachLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh bg-background">
      <CoachSidebar />
      <main>
        <div className="p-6 pt-20 lg:p-8 lg:pt-20">
          {children}
        </div>
      </main>
    </div>
  )
}
