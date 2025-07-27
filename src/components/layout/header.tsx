
'use client';

import { useState } from 'react';
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

const generateSlug = (text: string) => text.toLowerCase().replace(/\s+/g, '-');

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Web Development', href: `/category/${generateSlug('Web Development')}` },
    { name: 'AI', href: `/category/${generateSlug('AI')}` },
    { name: 'Social Media Marketing', href: `/category/${generateSlug('Social Media Marketing')}` },
    { name: 'Latest Trends', href: `/category/${generateSlug('Latest Trends')}` },
  ];

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
