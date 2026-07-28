import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Building, DollarSign, Calendar, Share2, Flag, Printer } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

import { SaveJobButton } from "@/components/save-job-button";

// This is a dynamic route page for Next.js App Router
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const job = await prisma.job.findUnique({ where: { id: resolvedParams.id } });
  
  if (!job) return { title: "Job Not Found - EasyJobs" };
  
  return {
    title: `${job.title} at ${job.companyName} - EasyJobs`,
    description: `Apply for the ${job.title} position at ${job.companyName} in ${job.city}, ${job.country}.`,
  };
}

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const job = await prisma.job.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!job) {
    notFound();
  }

  const skillsArray = job.skills ? job.skills.split(',').filter(Boolean) : [];

  const similarJobs = await prisma.job.findMany({
    where: { 
      id: { not: job.id },
      status: "PENDING"
    },
    take: 3,
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Header + Description) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
            {/* Header Section */}
            <div className="p-6 md:p-8 border-b flex flex-col md:flex-row gap-6 items-start justify-between">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center text-3xl font-bold text-muted-foreground">
                    {job.companyName.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{job.title}</h1>
                    <p className="text-xl text-muted-foreground mt-1">{job.companyName}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-4">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.city}, {job.country}</span>
                  <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.employmentType} ({job.workMode})</span>
                  {job.salaryMin && job.salaryMax && (
                    <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> ${job.salaryMin/1000}k - ${job.salaryMax/1000}k</span>
                  )}
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {skillsArray.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full md:w-auto shrink-0 mt-4 md:mt-0">
                <SaveJobButton jobId={job.id} />
              </div>
            </div>

            {/* Description Section */}
            <div className="p-6 md:p-8 prose prose-slate dark:prose-invert max-w-none">
              {/* Extremely simple markdown rendering for MVP. In prod use react-markdown */}
              {job.description.split('\n').map((line, i) => {
                if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{line.replace('## ', '')}</h2>;
                if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc mb-1">{line.replace('- ', '')}</li>;
                if (line.trim() === '') return <br key={i} />;
                return <p key={i} className="mb-4">{line}</p>;
              })}
              
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                <div className="flex flex-col gap-2 text-muted-foreground not-prose">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">Email:</span>
                    <a href={`mailto:${job.contactEmail}`} className="text-primary hover:underline">{job.contactEmail}</a>
                  </div>
                  {job.contactPhone && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">Phone:</span>
                      <a href={`tel:${job.contactPhone}`} className="text-primary hover:underline">{job.contactPhone}</a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 text-muted-foreground">
            <Button variant="ghost" size="sm" className="hover:text-foreground">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button variant="ghost" size="sm" className="hover:text-foreground">
              <Printer className="w-4 h-4 mr-2" /> Print
            </Button>
            <Button variant="ghost" size="sm" className="hover:text-destructive ml-auto">
              <Flag className="w-4 h-4 mr-2" /> Report Job
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Latest Jobs</h3>
            <div className="space-y-4">
              {similarJobs.length > 0 ? similarJobs.map((simJob) => (
                <Link href={`/job/${simJob.id}`} key={simJob.id} className="group block">
                  <h4 className="font-semibold group-hover:text-primary transition-colors text-sm line-clamp-1">{simJob.title}</h4>
                  <p className="text-xs text-muted-foreground">{simJob.companyName} • {simJob.city}, {simJob.country}</p>
                </Link>
              )) : (
                <p className="text-sm text-muted-foreground">No other jobs found.</p>
              )}
            </div>
            <Link href="/jobs" className={buttonVariants({ variant: "link", className: "w-full mt-4 text-primary" })}>
              View all jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
