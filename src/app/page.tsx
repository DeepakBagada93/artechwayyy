import { Post } from '@/lib/data';
import { supabase } from '@/lib/supabaseClient';
import { BlogPostCard } from '@/components/blog-post-card';
import { Typewriter } from '@/components/typewriter';
import { BlogFilters } from '@/components/blog-filters';

async function getPosts(): Promise<Post[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('posts').select('*').order('date', { ascending: false });
  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  return data as Post[];
}

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const posts = await getPosts();

  const searchTerm = (searchParams?.search as string) || '';
  const selectedTag = (searchParams?.tag as string) || 'all';

  const allTags = (() => {
    const tags = new Set<string>();
    posts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
    return ['all', ...Array.from(tags)];
  })();

  const filteredPosts = (() => {
    let filtered = posts;

    if (selectedTag !== 'all') {
      filtered = filtered.filter((post) => post.tags.includes(selectedTag));
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  })();

  const mainStory = filteredPosts[0];
  const topStories = filteredPosts.slice(1, 5);
  const otherStories = filteredPosts.slice(5);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center my-12 md:my-16">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white">
          The Intersection of
          <br />
          <Typewriter words={['Technology.', 'Art.', 'the Future.']} />
        </h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          Your daily brief on Web Development, AI, and Social Media Marketing.
          Stay ahead of the curve with expert insights and analysis.
        </p>
      </section>

      <BlogFilters allTags={allTags} />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {filteredPosts.length > 0 ? (
          <>
            {/* Main Story */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-headline mb-4 border-b-2 border-primary pb-2">
                Top Story
              </h2>
              {mainStory && <BlogPostCard post={mainStory} variant="featured" />}
            </div>

            {/* Side Stories */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-3xl font-headline mb-4 border-b-2 border-primary pb-2">
                Trending
              </h2>
              {topStories.map((post) => (
                <BlogPostCard key={post.slug} post={post} variant="compact" />
              ))}
            </div>

            {/* Other Stories */}
            {otherStories.length > 0 && (
               <div className="lg:col-span-3 mt-8">
                 <h2 className="text-3xl font-headline mb-4 border-b-2 border-primary pb-2">
                  More News
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherStories.map((post) => (
                    <BlogPostCard key={post.slug} post={post} />
                  ))}
                </div>
               </div>
            )}
          </>
        ) : (
          <div className="lg:col-span-3 text-center py-16">
            <h2 className="text-2xl font-headline">No posts found</h2>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search or filter.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
