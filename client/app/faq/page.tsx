// Example for app/faq/page.tsx
export default function FAQPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
      
      <div className="space-y-6">
        {/* Repeating Block for each FAQ */}
        <div className="border-b pb-4">
          <h3 className="font-semibold text-lg mb-2 text-primary">Is Gaya Rent free for tenants?</h3>
          <p className="text-muted-foreground">Yes! Searching for homes and contacting owners is 100% free with no brokerage fees involved.</p>
        </div>
        
        <div className="border-b pb-4">
          <h3 className="font-semibold text-lg mb-2 text-primary">How do I contact Shivam?</h3>
          <p className="text-muted-foreground">For support, you can reach out via the contact page or call +91 7717742739.</p>
        </div>
      </div>
    </main>
  );
}