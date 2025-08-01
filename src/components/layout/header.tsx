
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
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
      
      const { data, error } = await supabase
        .from('posts')
        .select('category');
      
      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }
      
      processCategories(data.map(p => p.category));
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
            <Image src="/artechway.png" alt="Artechway Logo" width={100} height={80} />
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
                    <Image src="/artechway.png" alt="Artechway Logo" width={150} height={80} />
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
