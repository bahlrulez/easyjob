"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createJob(data: {
  title: string;
  companyName: string;
  description: string;
  employmentType: string;
  workMode: string;
  city: string;
  country: string;
  contactEmail: string;
  contactPhone?: string;
}) {
  const newJob = await prisma.job.create({
    data: {
      title: data.title,
      companyName: data.companyName,
      description: data.description,
      employmentType: data.employmentType,
      workMode: data.workMode,
      city: data.city,
      country: data.country,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      skills: "", // Default empty string since we changed to String for SQLite MVP
      slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
    },
  });

  revalidatePath("/");
  revalidatePath("/jobs");
  
  return { success: true, jobId: newJob.id };
}
