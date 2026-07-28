"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createJob } from "@/app/actions";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const jobSchema = z.object({
  title: z.string().min(3, "Title is required"),
  companyName: z.string().min(2, "Company name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  employmentType: z.string().min(1, "Required"),
  workMode: z.string().min(1, "Required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().optional(),
});

export default function PostJobPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [postedJobId, setPostedJobId] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      city: "",
      country: "",
      description: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof jobSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await createJob(data);
      if (result.success && result.jobId) {
        setPostedJobId(result.jobId);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to post job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 w-full relative">
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card border shadow-2xl rounded-3xl p-8 md:p-12 max-w-md w-full text-center flex flex-col items-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-3">Job Posted!</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Your job is now live and visible to thousands of candidates.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <Link href={`/job/${postedJobId}`} className="w-full">
                <Button size="lg" className="w-full h-12 text-lg rounded-xl">
                  View Job Listing <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full h-12 text-lg rounded-xl" onClick={() => window.location.href = '/'}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Post a Job</h1>
        <p className="text-muted-foreground">Reach thousands of job seekers. No account required.</p>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Job Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title <span className="text-destructive">*</span></Label>
                <Input id="title" placeholder="e.g. Senior React Developer" {...register("title")} />
                {errors.title && <p className="text-destructive text-sm">{errors.title.message as string}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name <span className="text-destructive">*</span></Label>
                <Input id="companyName" placeholder="e.g. Acme Corp" {...register("companyName")} />
                {errors.companyName && <p className="text-destructive text-sm">{errors.companyName.message as string}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employmentType">Employment Type <span className="text-destructive">*</span></Label>
                <select 
                  id="employmentType" 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  {...register("employmentType")}
                >
                  <option value="">Select type</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                </select>
                {errors.employmentType && <p className="text-destructive text-sm">{errors.employmentType.message as string}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="workMode">Work Mode <span className="text-destructive">*</span></Label>
                <select 
                  id="workMode" 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  {...register("workMode")}
                >
                  <option value="">Select mode</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
                {errors.workMode && <p className="text-destructive text-sm">{errors.workMode.message as string}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
                <Input id="city" placeholder="e.g. San Francisco" {...register("city")} />
                {errors.city && <p className="text-sm text-destructive">{errors.city.message as string}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country <span className="text-destructive">*</span></Label>
                <Input id="country" placeholder="e.g. United States" {...register("country")} />
                {errors.country && <p className="text-sm text-destructive">{errors.country.message as string}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description <span className="text-destructive">*</span></Label>
              <Textarea 
                id="description" 
                placeholder="Describe the responsibilities and requirements..." 
                className="min-h-[150px]"
                {...register("description")} 
              />
              {errors.description && <p className="text-destructive text-sm">{errors.description.message as string}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email <span className="text-destructive">*</span></Label>
                <Input id="contactEmail" type="email" placeholder="Where should candidates apply?" {...register("contactEmail")} />
                {errors.contactEmail && <p className="text-sm text-destructive">{errors.contactEmail.message as string}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone Number (Optional)</Label>
                <Input id="contactPhone" type="tel" placeholder="e.g. +1 234 567 8900" {...register("contactPhone")} />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full text-lg h-12 rounded-xl" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Job for Free"}
          </Button>
        </form>
      </div>
    </div>
  );
}
