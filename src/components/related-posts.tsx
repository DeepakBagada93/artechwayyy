
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RelatedPostsProps {
  currentPostSlug: string;
  category: string;
}

interface RelatedPost {
    title: string;
    slug: string;
}

async function getRelatedPosts(currentPostSlug: string, category: string): Promise<RelatedPost[]> {
  if (!supabase || !category) return [];
  
  const { data, error } = await supabase
    .from('posts')
    .select('title, slug')
    .eq('category', category)
    .not('slug', 'eq', currentPostSlug)
    .limit(3);

  if (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
  
  return data || [];
}


export function RelatedPosts({ currentPostSlug, category }: RelatedPostsProps) {
  const [related, setRelated] = useState<RelatedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
        setIsLoading(true);
        const posts = await getRelatedPosts(currentPostSlug, category);
        setRelated(posts);
        setIsLoading(false);
    }
    if (currentPostSlug && category) {
        fetchRelated();
    }
  }, [currentPostSlug, category]);

  if (isLoading) {
    return (
        <Card className="bg-card/50 border-border/50">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Related Articles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </CardContent>
        </Card>
    )
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
