"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface WorkerAboutProps {
  bio: string;
  skills: string[];
}

export function WorkerAbout({ bio, skills }: WorkerAboutProps) {
  return (
    <Card className="mb-6">
      <CardContent>
        <h3 className="text-xl font-semibold mb-4 text-foreground">About Me</h3>
        <p className="text-foreground leading-relaxed mb-6">{bio}</p>

        <h4 className="font-semibold mb-3">Skills & Expertise</h4>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
