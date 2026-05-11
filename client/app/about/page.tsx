export default function AboutPage() {
  const stats = [
    { label: "Verified Listings", value: "2,000+" },
    { label: "Successful Matches", value: "500+" },
    { label: "Cities Covered", value: "10+" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-6 text-primary underline decoration-amber-500 underline-offset-8">Gaya Rent</h1>
        <p className="text-xl leading-relaxed text-muted-foreground">
          At Gaya Rent, we believe finding a home shouldn't be a headache. We provide a platform where tenants and owners connect directly, cutting out unnecessary brokerage and middle-men.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-center">
        {stats.map((stat, i) => (
          <div key={i} className="p-8 border rounded-xl bg-card shadow-sm">
            <h3 className="text-3xl font-bold text-primary mb-2">{stat.value}</h3>
            <p className="text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto bg-secondary/20 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
        <p className="italic text-lg">"I found a flat in 2 days and spoke directly to the owner via WhatsApp. No extra fees, just a smooth process!"</p>
        <p className="mt-4 font-semibold text-primary">- Rajesh M., Tenant</p>
      </div>
    </div>
  );
}