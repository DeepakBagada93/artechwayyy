
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Post } from '@/lib/data';
import { supabase } from '@/lib/supabaseClient';
import { BlogPostCard } from '@/components/blog-post-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Typewriter } from '@/components/typewriter';

async function getPosts(): Promise<Post[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('posts').select('*').order('date', { ascending: false });
  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  return data as Post[];
}

export default function Home() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const posts = await getPosts();
      setAllPosts(posts);
      setIsLoading(false);
    };
    fetchPosts();
  }, []);

  const searchTerm = searchParams.get('search') || '';
  const selectedTag = searchParams.get('tag') || 'all';

  const filteredPosts = allPosts.filter(post => {
    const tagMatch = selectedTag === 'all' || post.tags.includes(selectedTag);
    const searchMatch = !searchTerm ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return tagMatch && searchMatch;
  });

  const mainStory = filteredPosts[0];
  const topStories = filteredPosts.slice(1, 5);
  const otherStories = filteredPosts.slice(5);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center my-12 md:my-16">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white">
          The Intersection of Art,
          <br />
          and the <Typewriter words={['Technology', 'Future']} />
        </h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          Your daily brief on Web Development, AI, and Social Media Marketing.
          Stay ahead of the curve with expert insights and analysis.
        </p>
      </section>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-[480px] w-full" />
            </div>
            <div className="lg:col-span-1 space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {mainStory && (
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-headline mb-4 border-b-2 border-primary pb-2">
                  Top Story
                </h2>
                <BlogPostCard post={mainStory} variant="featured" />
              </div>
            )}
            
            {topStories.length > 0 && (
                <div className="lg:col-span-1 space-y-4">
                  <h2 className="text-3xl font-headline mb-4 border-b-2 border-primary pb-2">
                    Trending
                  </h2>
                  {topStories.map((post) => (
                    <BlogPostCard key={post.slug} post={post} variant="compact" />
                  ))}
                </div>
            )}
          </section>

          {otherStories.length > 0 && (
            <section className="mt-12">
                <h2 className="text-3xl font-headline mb-4 border-b-2 border-primary pb-2">
                More News
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherStories.map((post) => (
                    <BlogPostCard key={post.slug} post={post} />
                ))}
                </div>
            </section>
          )}

          {allPosts.length === 0 && !isLoading && (
             <div className="text-center py-16">
                <h2 className="text-2xl font-headline">No posts found</h2>
                <p className="text-muted-foreground mt-2">
                  It looks like there are no posts here yet.
                </p>
              </div>
          )}
        </>
      )}
    </div>
  );
}
