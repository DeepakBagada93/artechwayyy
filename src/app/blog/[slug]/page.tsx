import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Post } from '@/lib/data';
import { supabase } from '@/lib/supabaseClient';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import { RelatedPosts } from '@/components/related-posts';
import { Separator } from '@/components/ui/separator';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

async function getPost(slug: string): Promise<Post | null> {
    if (!supabase) return null;
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }
  return data as Post;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8">
        <div className="relative h-72 md:h-96 w-full overflow-hidden rounded-lg mb-8 shadow-2xl shadow-black/30">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
            data-ai-hint={post.dataAiHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        
        <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-sm">{tag}</Badge>
            ))}
        </div>

        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>
        </div>
      </header>

      <div className="prose prose-invert prose-lg max-w-none text-foreground/90 leading-relaxed space-y-6">
        {post.content.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      
      <Separator className="my-12 bg-border/20" />

      <aside className="space-y-8">
          <RelatedPosts 
            currentPostSlug={post.slug}
          />
      </aside>
    </article>
  );
}
