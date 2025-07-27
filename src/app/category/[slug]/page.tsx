
import { notFound } from 'next/navigation';
import { Post } from '@/lib/data';
import { supabase } from '@/lib/supabaseClient';
import { BlogPostCard } from '@/components/blog-post-card';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

const getCategoryNameFromSlug = (slug: string) => {
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
    .contains('tags', [categoryName])
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching posts by category:', error);
    return { posts: [], categoryName };
  }

  return { posts: data as Post[], categoryName };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { posts, categoryName } = await getPostsByCategory(params.slug);

  if (posts.length === 0) {
    // You might want a more specific "no posts in this category" message
    // but for now, we can show a generic not found.
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
