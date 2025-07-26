import Link from 'next/link';
import { Rss } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function Header() {
  const navLinks = [
    { name: 'Web Development', href: '/?tag=Web+Development' },
    { name: 'AI', href: '/?tag=AI' },
    { name: 'Social Media', href: '/?tag=Social+Media' },
    { name: 'Design', href: '/?tag=Design' },
    { name: 'SEO', href: '/?tag=SEO' }
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
      </div>
      <Separator className="bg-border/20" />
    </header>
  );
}
