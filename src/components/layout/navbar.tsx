import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 sm:px-8">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl text-primary tracking-tight">EasyJobs</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Find Jobs
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            {/* Glowing background animation */}
            <div className="absolute -inset-0.5 bg-primary rounded-full blur opacity-40 group-hover:opacity-70 transition duration-500 animate-pulse"></div>
            
            <Link 
              href="/post-job" 
              className={buttonVariants({ 
                className: "relative rounded-full shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5" 
              })}
            >
              Post a Job (Free)
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
