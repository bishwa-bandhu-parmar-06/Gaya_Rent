import { BookOpen, ShieldCheck, FileText, Smartphone } from "lucide-react";

export default function ResourcesPage() {
  const guides = [
    {
      title: "Tenant Safety Guide",
      desc: "How to verify a property and owner before paying any security deposit.",
      icon: <ShieldCheck size={24} />,
      link: "#"
    },
    {
      title: "Rental Agreement Template",
      desc: "A standard legal template you can use for your 11-month lease.",
      icon: <FileText size={24} />,
      link: "#"
    },
    {
      title: "Moving Checklist",
      desc: "Everything you need to do before moving into your new home.",
      icon: <BookOpen size={24} />,
      link: "#"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Resources & Guides</h1>
      <p className="text-muted-foreground mb-10">Tools and information to make your rental journey easier.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {guides.map((guide, i) => (
          <div key={i} className="flex gap-4 p-6 rounded-xl border bg-card hover:bg-secondary/10 transition-colors cursor-pointer group">
            <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              {guide.icon}
            </div>
            <div>
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{guide.title}</h3>
              <p className="text-muted-foreground text-sm">{guide.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-primary rounded-2xl p-8 text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Need direct help?</h2>
          <p className="opacity-90">Our support team is available 10 AM - 7 PM for your queries.</p>
        </div>
        <a href="tel:+917717742739" className="bg-white text-primary px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all">
          Call Shivam Kumar
        </a>
      </div>
    </div>
  );
}