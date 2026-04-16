"use client"

import Link from "next/link"
import { Activity, Menu, X, LogOut, User as UserIcon, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const isAuthenticated = status === "authenticated"

  return (
    <header className="sticky top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-7xl">
      <div className="glass shadow-3d rounded-2xl flex h-16 items-center justify-between px-6 transition-all duration-300">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">HealthAI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/symptoms" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Symptom Checker
          </Link>
          <Link href="/pharmacies" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Medical Stores
          </Link>
          <Link href="/medicines" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Medicines Database
          </Link>
          <Link href="/report-analyzer" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Report Analyzer
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {session?.user?.name?.charAt(0)?.toUpperCase() || <UserIcon className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-foreground">{session?.user?.name}</p>
                  <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col p-4 gap-3">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/symptoms" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
              Symptom Checker
            </Link>
            <Link href="/pharmacies" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
              Medical Stores
            </Link>
            <Link href="/medicines" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
              Medicines Database
            </Link>
            <Link href="/report-analyzer" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
              Report Analyzer
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </Link>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                Theme
              </Button>
            </div>
            <div className="flex flex-col gap-2 pt-3 border-t border-border">
              {isAuthenticated ? (
                <>
                  <p className="text-sm font-medium text-foreground px-2">{session?.user?.name}</p>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => signOut({ callbackUrl: "/" })}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="justify-start" asChild>
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
