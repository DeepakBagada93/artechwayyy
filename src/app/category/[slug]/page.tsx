
import { Post } from '@/lib/data';
import { supabase } from '@/lib/supabaseClient';
import { BlogPostCard } from '@/components/blog-post-card';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  if (!supabase) return [];
  
  // Convert slug back to title case for matching
  const categoryName = categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('category', categoryName)
    .order('date', { ascending: false });

  if (error) {
    console.error(`Error fetching posts for category "${categoryName}":`, error);
    return [];
  }
  
  return data || [];
}


export default async function CategoryPage({ params: { slug } }: CategoryPageProps) {
  const posts = await getPostsByCategory(slug);
  const categoryName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');


  if (!posts || posts.length === 0) {
    return (
        <div className="container mx-auto px-4 py-8">
            <section className="my-12 md:my-16">
                <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white text-center">
                  {categoryName}
                </h1>
            </section>
            <section className="text-center py-16">
                <h2 className="text-2xl font-headline">No posts yet</h2>
                <p className="text-muted-foreground mt-2">
                    There are currently no blog posts in the &quot;{categoryName}&quot; category. Please check back later.
                </p>
            </section>
      </div>
    )
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
