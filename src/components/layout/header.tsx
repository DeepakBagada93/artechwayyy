
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Rss, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { supabase } from '@/lib/supabaseClient';

const generateSlug = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navLinks, setNavLinks] = useState<{name: string, href: string}[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      if (!supabase) return;

      // Using an RPC call to a Postgres function to get distinct categories
      // This is often more reliable with RLS policies in place.
      // Assumes a function `get_distinct_categories` exists. This should be created via a migration.
      const { data, error } = await supabase.rpc('get_distinct_categories');

      if (error) {
        console.error("Error fetching categories via rpc. Please ensure the 'get_distinct_categories' function exists and has correct permissions.", error);
        return;
      }
      
      const categories = data.map(item => item.category);
      processCategories(categories);
    }

    function processCategories(categories: (string | null)[]) {
      const uniqueCategories = [...new Set(categories.filter(Boolean))];
      const sortedCategories = uniqueCategories.sort() as string[];

      const links = sortedCategories.map((category: string) => ({
        name: category,
        href: `/category/${generateSlug(category)}`
      }));
      setNavLinks(links);
    }
    
    fetchCategories();
  }, []);


  return (
    <header className="px-4 md:px-6 sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Rss className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold tracking-tight text-white">
            Artechway
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="p-4 border-b">
                 <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Rss className="h-8 w-8 text-primary" />
                    <span className="font-headline text-2xl font-bold tracking-tight text-white">
                        Artechway
                    </span>
                 </Link>
              </SheetHeader>
              <div className="p-4">
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <Separator className="bg-border/20" />
    </header>
  );
}
