import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin } from "lucide-react";
import { JobCard } from "@/components/job-card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const latestJobs = await prisma.job.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    where: { status: "PENDING" }, // Default status
  });

  return (
    <div className="flex flex-col items-center w-full min-h-screen pb-20">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-primary/10 to-background pt-20 pb-16 px-4 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl mb-6">
          Find your next job in <span className="text-primary">seconds.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
          The fastest way to discover opportunities or hire top talent. No account required.
        </p>

        {/* Search Bar Container */}
        <form action="/jobs" className="w-full max-w-4xl bg-card rounded-2xl shadow-xl border p-2 flex flex-col md:flex-row gap-2">
          <div className="flex-1 flex items-center px-4 bg-muted/30 rounded-xl">
            <Search className="w-5 h-5 text-muted-foreground mr-2" />
            <Input 
              name="q"
              type="text" 
              placeholder="Job title, skills, or company" 
              className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-base h-12"
            />
          </div>
          <div className="flex-1 flex items-center px-4 bg-muted/30 rounded-xl">
            <MapPin className="w-5 h-5 text-muted-foreground mr-2" />
            <Input 
              name="loc"
              type="text" 
              placeholder="City, state, or country" 
              className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-base h-12"
            />
          </div>
          <div className="relative group w-full md:w-auto mt-2 md:mt-0">
            {/* Glowing background animation */}
            <div className="absolute -inset-0.5 bg-primary rounded-xl blur opacity-40 group-hover:opacity-70 group-hover:bg-red-500 transition duration-500 animate-pulse"></div>
            
            <Button 
              type="submit" 
              size="lg" 
              className="relative rounded-xl h-12 px-8 text-lg w-full md:w-auto shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:bg-red-500 hover:text-white"
            >
              Search
            </Button>
          </div>
        </form>

        {/* Trending Tags */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-3xl">
          <span className="text-sm text-muted-foreground flex items-center mr-2">Trending:</span>
          {["Remote", "React", "Next.js", "Marketing", "New York", "London", "Design"].map((tag) => (
            <Badge key={tag} variant="secondary" className="hover:bg-primary/20 cursor-pointer transition-colors px-3 py-1">
              {tag}
            </Badge>
          ))}
        </div>
      </section>

      {/* Statistics */}
      <section className="w-full max-w-5xl px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {[
          { label: "Active Jobs", value: "250,000+" },
          { label: "Companies", value: "18,000+" },
          { label: "Countries", value: "120" },
          { label: "Updated", value: "Every minute" }
        ].map((stat, i) => (
          <div key={i} className="flex flex-col gap-1 p-4 rounded-2xl bg-card border shadow-sm">
            <span className="text-3xl font-bold text-foreground">{stat.value}</span>
            <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Latest Jobs Feed */}
      <section className="w-full max-w-5xl px-4 py-12 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-8 w-full text-left">Latest Opportunities</h2>
        
        {latestJobs.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No jobs found. Be the first to post a job!
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestJobs.map((job) => (
              <JobCard 
                key={job.id} 
                id={job.id}
                title={job.title}
                companyName={job.companyName}
                location={`${job.city}, ${job.country}`}
                employmentType={job.employmentType}
                workMode={job.workMode}
                salaryMin={job.salaryMin || 0}
                salaryMax={job.salaryMax || 0}
                postedAt={new Date(job.createdAt).toLocaleDateString()}
              />
            ))}
          </div>
        )}
        
        <Link href="/jobs" passHref>
          <Button variant="outline" size="lg" className="mt-10 rounded-full px-8">
            View All Jobs
          </Button>
        </Link>
      </section>
    </div>
  );
}
