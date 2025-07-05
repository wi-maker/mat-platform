'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Wrench, LayoutDashboard, Car, BellRing, Settings, BarChart3, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/assets', label: 'Assets', icon: Car },
  { href: '/dashboard/recommendations', label: 'Recommendations', icon: Wand2 },
  { href: '/dashboard/reminders', label: 'Reminders', icon: BellRing },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [overdueCount, setOverdueCount] = useState(0)

  useEffect(() => {
    async function fetchOverdueCount() {
      try {
        const response = await fetch('/api/reminders?filter=overdue')
        if (response.ok) {
          const data = await response.json()
          setOverdueCount(data.length)
        }
      } catch (error) {
        console.error('Failed to fetch overdue reminders count:', error)
      }
    }

    fetchOverdueCount()
    // Re-fetch when navigating, to keep the count fresh
  }, [pathname])

  return (
    <aside className="hidden border-r bg-gray-100/40 lg:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Wrench className="h-6 w-6 text-orange-500" />
            <span>MAT Platform</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900',
                  { 'bg-gray-100 text-gray-900': pathname.startsWith(href) }
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{label}</span>
                {label === 'Reminders' && overdueCount > 0 && (
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500">
                    {overdueCount}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  )
}
