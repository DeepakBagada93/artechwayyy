
import { notFound } from 'next/navigation';
import { Post } from '@/lib/data';
import { supabase } from '@/lib/supabaseClient';
import { BlogPostCard } from '@/components/blog-post-card';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
    if (!supabase) return [];
    
    const { data, error } = await supabase.from('posts').select('tags');
    if (error) {
        console.error('Error fetching tags for static params:', error);
        return [];
    }

    if (!data) return [];

    const generateSlug = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const tags = new Set<string>();
    data.forEach(post => {
        if (post.tags) {
            post.tags.forEach(tag => {
                tags.add(generateSlug(tag));
            });
        }
    });

    return Array.from(tags).map(slug => ({
        slug,
    }));
}


const getCategoryNameFromSlug = (slug: string) => {
    // This is a simple conversion. For more complex cases, you might need a mapping.
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}


async function getPostsByCategory(slug: string): Promise<{ posts: Post[], categoryName: string }> {
  if (!supabase) return { posts: [], categoryName: '' };
  
  const categoryName = getCategoryNameFromSlug(slug);

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .filter('tags', 'cs', `{${categoryName}}`) // Use contains with curly braces for array
    .order('date', { ascending: false });

  if (error) {
    console.error(`Error fetching posts for category "${categoryName}":`, error);
    return { posts: [], categoryName };
  }

  return { posts: data as Post[], categoryName };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { posts, categoryName } = await getPostsByCategory(params.slug);

  if (posts.length === 0) {
    // Instead of notFound(), maybe show a message? Or notFound() is fine if no posts for a category is an error state.
    // For now we will keep notFound() as it was.
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="my-12 md:my-16">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white text-center">
          {categoryName}
        </h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto text-center">
          Articles and insights on {categoryName}.
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
