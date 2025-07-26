'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRelatedPosts } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';

interface RelatedPostsProps {
  currentArticleContent: string;
  currentPostSlug: string;
  availablePosts: { title: string; slug: string }[];
}

export function RelatedPosts({ currentArticleContent, currentPostSlug, availablePosts }: RelatedPostsProps) {
  const [related, setRelated] = useState<{ title: string; slug: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      setIsLoading(true);
      const otherPosts = availablePosts.filter(p => p.slug !== currentPostSlug);
      const relatedData = await getRelatedPosts({
        currentArticleContent,
        availablePosts: otherPosts.map(p => p.title),
      });
      // Ensure we only suggest posts that are not the current one and limit to 3
      const filteredRelated = relatedData.filter(p => p.slug !== currentPostSlug).slice(0, 3);
      setRelated(filteredRelated);
      setIsLoading(false);
    }
    fetchRelated();
  }, [currentArticleContent, availablePosts, currentPostSlug]);

  if (isLoading) {
    return (
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Related Articles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (related.length === 0) {
    return null; // Don't show the section if there are no related posts
  }

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Related Articles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/10 group transition-colors"
          >
            <span className="text-primary-foreground group-hover:text-primary transition-colors">{post.title}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
