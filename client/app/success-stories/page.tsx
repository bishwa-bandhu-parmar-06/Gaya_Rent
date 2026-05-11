"use client";
import { Quote, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function SuccessStories() {
  const stories = [
    {
      name: "Arjun Sharma",
      role: "Software Engineer",
      content: "Found a 2BHK in Gaya within 48 hours. The best part was talking directly to the owner on WhatsApp without any brokers interfering.",
      location: "Gaya, Bihar"
    },
    {
      name: "Priya Singh",
      role: "Student",
      content: "As a student, budget was my main concern. Gaya Rent helped me find a verified hostel room that fits my pocket perfectly.",
      location: "Patna, Bihar"
    },
    {
      name: "Amit Verma",
      role: "Property Owner",
      content: "I listed my apartment on Friday and had a verified tenant by Monday. The dashboard is so easy to use for managing my properties.",
      location: "Bodh Gaya"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Success Stories</h1>
        <p className="text-muted-foreground text-lg">See how we are helping thousands find their perfect stay.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories.map((story, i) => (
          <Card key={i} className="relative overflow-hidden border-primary/10 hover:shadow-md transition-shadow">
            <CardContent className="pt-8">
              <Quote className="absolute top-4 right-4 text-primary/10" size={40} />
              <div className="flex gap-1 mb-4 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-foreground/80 mb-6 italic">"{story.content}"</p>
              <div className="border-t pt-4">
                <p className="font-bold">{story.name}</p>
                <p className="text-sm text-muted-foreground">{story.role} • {story.location}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}