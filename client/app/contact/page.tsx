"use client";
import { Mail, Phone, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-muted-foreground">Have questions? We're here to help you find your perfect home.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full text-primary"><User size={24} /></div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Owner</p>
                <p className="text-lg font-semibold">Shivam Kumar</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full text-primary"><Phone size={24} /></div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Phone</p>
                <a href="tel:+917717742739" className="text-lg font-semibold hover:underline">+91 7717742739</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full text-primary"><Mail size={24} /></div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Email</p>
                <p className="text-lg font-semibold">support@gayarent.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <form className="space-y-4">
          <input type="text" placeholder="Your Name" className="w-full p-3 rounded-md border bg-background" />
          <input type="email" placeholder="Your Email" className="w-full p-3 rounded-md border bg-background" />
          <textarea placeholder="How can we help?" rows={4} className="w-full p-3 rounded-md border bg-background"></textarea>
          <Button className="w-full py-6 text-lg font-bold">SEND MESSAGE</Button>
        </form>
      </div>
    </div>
  );
}