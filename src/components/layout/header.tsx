import Link from 'next/link';
import { Rss } from 'lucide-react';

export function Header() {
  return (
    <header className="py-6 px-4 md:px-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Rss className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold tracking-tight text-white">
            Artechway
          </span>
        </Link>
        <nav>
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}
