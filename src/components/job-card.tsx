import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface JobCardProps {
  id: string;
  title: string;
  companyName: string;
  location: string;
  employmentType: string;
  salaryMin?: number;
  salaryMax?: number;
  postedAt: string;
  workMode: string;
}

export function JobCard({
  id,
  title,
  companyName,
  location,
  employmentType,
  salaryMin,
  salaryMax,
  postedAt,
  workMode,
}: JobCardProps) {
  const formatSalary = (min?: number, max?: number) => {
    if (min && max) return `$${min/1000}k - $${max/1000}k`;
    if (min) return `From $${min/1000}k`;
    if (max) return `Up to $${max/1000}k`;
    return null;
  };

  const salaryStr = formatSalary(salaryMin, salaryMax);

  return (
    <Link href={`/job/${id}`} className="block">
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-muted bg-card group">
        <CardContent className="p-6 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-xl font-bold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              {companyName.charAt(0)}
            </div>
            <Badge variant="outline" className="text-xs bg-background/50 backdrop-blur-sm">{postedAt}</Badge>
          </div>
          <div>
            <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-muted-foreground text-sm">{companyName} • {location}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{workMode}</Badge>
            <Badge variant="secondary" className="bg-secondary/50">{employmentType}</Badge>
            {salaryStr && (
              <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20">{salaryStr}</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
