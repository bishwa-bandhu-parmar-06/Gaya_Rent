export default function LegalPage({ title }: { title: string }) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 border-b pb-4">{title}</h1>
      <div className="prose dark:prose-invert max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-bold text-foreground">1. Introduction</h2>
          <p>By using Gaya Rent, you agree to these terms. We provide a platform for rental listings...</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground">2. User Responsibility</h2>
          <p>Users are responsible for verifying property details and owner credentials...</p>
        </section>
      </div>
    </div>
  );
}