
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Post } from '@/lib/data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function generateSlug(text: string) {
  if (!text) return '';
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

interface BlogPostCardProps {
  post: Post;
  variant?: 'default' | 'featured' | 'compact';
}

export function BlogPostCard({ post, variant = 'default' }: BlogPostCardProps) {
  const router = useRouter();
  const categoryLink = post.category ? `/category/${generateSlug(post.category)}` : '#';

  const handleCategoryClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); 
    e.preventDefault();
    router.push(categoryLink);
  };

  const CategoryBadge = () => {
    return (
        <div onClick={handleCategoryClick} className="z-10 relative inline-block cursor-pointer">
            <Badge variant="default" className="text-xs">{post.category}</Badge>
        </div>
    )
  }

  if (variant === 'featured') {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <Card className="relative h-full flex flex-col overflow-hidden transition-all duration-300 hover:border-primary">
          <CardHeader className="p-0 relative">
            <div className="relative h-96 w-full overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                data-ai-hint={post.dataAiHint}
              />
               <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
            <CardContent className="p-6 absolute bottom-0">
               <div className="mb-2 flex flex-wrap gap-2">
                  <CategoryBadge />
              </div>
              <CardTitle className="font-headline text-3xl text-white leading-tight mb-2 group-hover:text-primary transition-colors break-words">
                {post.title}
              </CardTitle>
              <p className="text-slate-300 text-sm max-w-prose line-clamp-2">{post.excerpt}</p>
            </CardContent>
          </CardHeader>
        </Card>
      </Link>
    );
  }
  
  if (variant === 'compact') {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <Card className="flex items-start overflow-hidden transition-all duration-300 hover:bg-secondary/50 border-0 border-b rounded-none last:border-b-0 py-4">
          <div className="flex-grow">
            <CardTitle className="font-headline text-base leading-tight group-hover:text-primary transition-colors">
              {post.title}
            </CardTitle>
             <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                <span>{post.author}</span>
                <span>&middot;</span>
                <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</time>
             </div>
          </div>
           <div className="relative h-16 w-16 overflow-hidden rounded-md ml-4 flex-shrink-0">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                data-ai-hint={post.dataAiHint}
                sizes="64px"
              />
            </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:border-primary/50 hover:bg-secondary/20">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={post.dataAiHint}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4">
           <div className="mb-2">
                <CategoryBadge />
           </div>
          <CardTitle className="font-headline text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
          <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-xs text-muted-foreground p-4 pt-0">
          <div className="flex items-center gap-2">
            <User className="h-3 w-3" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</time>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
