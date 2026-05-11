export default function PricingPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium mb-4">
        Coming Soon
      </div>
      <h1 className="text-4xl md:text-6xl font-bold mb-6">Premium Plans for Owners</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mb-8">
        We are crafting the best value plans to help owners list and manage properties with advanced analytics and WhatsApp automation.
      </p>
      <div className="w-full max-w-md flex gap-2">
        <input type="email" placeholder="Enter email for early access" className="flex-1 p-3 rounded-md border bg-background" />
        <button className="bg-primary text-white px-6 py-3 rounded-md font-bold transition-transform active:scale-95">NOTIFY ME</button>
      </div>
    </div>
  );
}