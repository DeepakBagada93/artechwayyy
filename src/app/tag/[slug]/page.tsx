
import { Post } from '@/lib/data';
import { supabase } from '@/lib/supabaseClient';
import { BlogPostCard } from '@/components/blog-post-card';

interface TagPageProps {
  params: {
    slug: string;
  };
}

const getTagNameFromSlug = (slug: string) => {
    if (!slug) return '';
    // Handle multi-word tags like "social-media-marketing"
    if (slug.includes('-')) {
         return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    // Handle single word tags like "ai"
    return slug.toUpperCase();
}


async function getPostsByTag(slug: string): Promise<{ posts: Post[], tagName: string }> {
  if (!supabase) return { posts: [], tagName: '' };
  
  const tagName = getTagNameFromSlug(slug);

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .filter('tags', 'cs', `{${tagName}}`)
    .order('date', { ascending: false });

  if (error) {
    console.error(`Error fetching posts for tag "${tagName}":`, error);
    return { posts: [], tagName };
  }

  return { posts: (data || []) as Post[], tagName };
}

export default async function TagPage({ params }: TagPageProps) {
  const { posts, tagName } = await getPostsByTag(params.slug);

  if (!posts || posts.length === 0) {
    return (
        <div className="container mx-auto px-4 py-8">
            <section className="my-12 md:my-16">
                <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white text-center">
                {tagName}
                </h1>
            </section>
            <section className="text-center py-16">
                <h2 className="text-2xl font-headline">No posts yet</h2>
                <p className="text-muted-foreground mt-2">
                    There are currently no blog posts with the tag &quot;{tagName}&quot;. Please check back later.
                </p>
            </section>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="my-12 md:my-16">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white text-center">
          {tagName}
        </h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto text-center">
          Articles and insights on {tagName}.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </section>
    </div>
  );
}
