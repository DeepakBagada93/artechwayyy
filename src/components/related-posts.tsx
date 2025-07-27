import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface RelatedPostsProps {
  currentPostSlug: string;
}

async function getRelatedPosts(currentPostSlug: string): Promise<{ title: string; slug: string }[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('posts')
    .select('title, slug')
    .not('slug', 'eq', currentPostSlug)
    .limit(3);

  if (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
  
  return data || [];
}


export async function RelatedPosts({ currentPostSlug }: RelatedPostsProps) {
  const related = await getRelatedPosts(currentPostSlug);

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
