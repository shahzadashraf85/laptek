import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/store/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Needs a Navbar */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32 bg-slate-950 text-white">
        <div className="container px-4 md:px-6 relative z-10 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge variant="outline" className="text-emerald-400 border-emerald-400">New Arrivals 2026</Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 py-2">
                Next-Gen IT Gear
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                Upgrade your setup with the latest laptops, powerful desktops, and essential accessories.
                Synced with Amazon & Best Buy.
              </p>
            </div>
            <div className="space-x-4 pt-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8" size="lg">Shop Now</Button>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black h-12 px-8" size="lg">View Deals</Button>
            </div>
          </div>
        </div>
        {/* Abstract Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 text-foreground">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Laptops', 'Desktops', 'Phones', 'Accessories'].map((cat) => (
              <Link href={`/products?category=${cat.toLowerCase()}`} key={cat} className="group relative overflow-hidden rounded-xl border bg-background p-8 hover:shadow-xl transition-all hover:border-blue-500/50">
                <div className="flex flex-col h-full justify-between">
                  <h3 className="text-xl font-bold">{cat}</h3>
                  <p className="text-sm text-gray-500 mt-2 group-hover:text-blue-500 transition-colors">Explore Collection &rarr;</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 md:py-0 border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2026 LapTek. All rights reserved. Built with Next.js & Firebase.
          </p>
        </div>
      </footer>
    </div>
  );
}
