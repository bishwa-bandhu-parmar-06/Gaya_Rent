import { Calendar, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const posts = [
    {
      title: "Why Gaya is becoming a hotspot for rentals in 2026",
      date: "May 5, 2026",
      category: "Market Trends",
      excerpt: "An in-depth look at how infrastructure projects are driving up rental demand in Bihar..."
    },
    {
      title: "5 Tips to decorate your rental flat on a budget",
      date: "April 28, 2026",
      category: "Lifestyle",
      excerpt: "Make your temporary house feel like a permanent home without breaking the bank..."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Blog & Insights</h1>
      
      <div className="space-y-12">
        {posts.map((post, i) => (
          <article key={i} className="group cursor-pointer">
            <div className="flex items-center gap-3 text-sm text-primary font-medium mb-3">
              <span className="bg-primary/10 px-2 py-0.5 rounded">{post.category}</span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar size={14} /> {post.date}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            <p className="text-muted-foreground text-lg mb-4 line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-2 text-primary font-bold group-hover:underline">
              Read Full Article <ArrowRight size={18} />
            </div>
            <div className="mt-8 border-b border-border"></div>
          </article>
        ))}
      </div>
    </div>
  );
}