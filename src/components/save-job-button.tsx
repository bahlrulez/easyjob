"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";

export function SaveJobButton({ jobId }: { jobId: string }) {
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Read from localStorage on mount
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    if (savedJobs.includes(jobId)) {
      setIsSaved(true);
    }
  }, [jobId]);

  const toggleSave = () => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    let newSavedJobs;
    
    if (isSaved) {
      newSavedJobs = savedJobs.filter((id: string) => id !== jobId);
      setIsSaved(false);
    } else {
      newSavedJobs = [...savedJobs, jobId];
      setIsSaved(true);
    }
    
    localStorage.setItem("savedJobs", JSON.stringify(newSavedJobs));
  };

  if (!mounted) {
    return (
      <Button variant="outline" size="lg" className="w-full md:w-48 h-12 rounded-xl">
        <Bookmark className="w-5 h-5 mr-2" />
        Save Job
      </Button>
    );
  }

  return (
    <Button 
      variant={isSaved ? "default" : "outline"} 
      size="lg" 
      className={`w-full md:w-48 h-12 rounded-xl ${isSaved ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
      onClick={toggleSave}
    >
      {isSaved ? (
        <>
          <BookmarkCheck className="w-5 h-5 mr-2" />
          Saved
        </>
      ) : (
        <>
          <Bookmark className="w-5 h-5 mr-2" />
          Save Job
        </>
      )}
    </Button>
  );
}
