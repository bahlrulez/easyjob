import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, SlidersHorizontal } from "lucide-react";

import { prisma } from "@/lib/prisma";

export default async function JobsPage({ searchParams }: { searchParams: Promise<{ q?: string, loc?: string }> }) {
  const resolvedParams = await searchParams;
  const { q, loc } = resolvedParams;

  const whereClause: any = { status: "PENDING" };
  
  const qOR = [];
  if (q) {
    qOR.push({ title: { contains: q } });
    qOR.push({ companyName: { contains: q } });
    qOR.push({ skills: { contains: q } });
  }

  const locOR = [];
  if (loc) {
    locOR.push({ city: { contains: loc } });
    locOR.push({ country: { contains: loc } });
  }

  if (qOR.length > 0 && locOR.length > 0) {
    whereClause.AND = [
      { OR: qOR },
      { OR: locOR }
    ];
  } else if (qOR.length > 0) {
    whereClause.OR = qOR;
  } else if (locOR.length > 0) {
    whereClause.OR = locOR;
  }

  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    where: whereClause,
  });

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Find Jobs</h1>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
        </Button>
      </div>

      {/* Sticky Sidebar for Desktop */}
      <aside className="hidden md:block w-64 shrink-0">
        <div className="sticky top-24 space-y-8">
          <div>
            <h2 className="text-lg font-bold mb-4">Filters</h2>
            <div className="space-y-4">
              
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="text" placeholder="Keywords..." className="pl-8" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Work Mode</Label>
                <div className="flex flex-col gap-2 mt-2">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" /> Remote</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" /> Hybrid</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" /> Onsite</label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Employment Type</Label>
                <div className="flex flex-col gap-2 mt-2">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" /> Full Time</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" /> Part Time</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" /> Contract</label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Salary Range (Min)</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                  <option value="">Any</option>
                  <option value="50000">$50,000+</option>
                  <option value="100000">$100,000+</option>
                  <option value="150000">$150,000+</option>
                </select>
              </div>

            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="hidden md:flex justify-between items-end mb-6">
          <h1 className="text-3xl font-bold">Search Results</h1>
          <span className="text-muted-foreground text-sm">Showing {jobs.length} jobs</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => (
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
        
        <div className="mt-8 flex justify-center">
          <Button variant="outline" size="lg">Load More</Button>
        </div>
      </main>
    </div>
  );
}
