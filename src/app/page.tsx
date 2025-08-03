
'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/lib/data';
import { supabase } from '@/lib/supabaseClient';
import { BlogPostCard } from '@/components/blog-post-card';
import { Progress } from '@/components/ui/progress';
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

function HomePageLoader() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 95) {
                    clearInterval(timer);
                    return 95;
                }
                return prev + 5;
            });
        }, 100);
        return () => clearInterval(timer);
    }, []);

    const loadingTexts = [
      "Brewing fresh content...",
      "Polishing pixels...",
      "Warming up the servers...",
      "Gathering the best stories...",
      "Almost there...",
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)]">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-headline text-white">
                    <Typewriter words={loadingTexts} />
                </h2>
                <Progress value={progress} className="w-64 mx-auto" />
                <p className="text-sm text-muted-foreground">Loading the latest in tech for you.</p>
            </div>
        </div>
    );
}


export default function Home() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const posts = await getPosts();
      setAllPosts(posts);
      // Add a small delay to prevent flash of content
      setTimeout(() => setIsLoading(false), 500);
    };
    fetchPosts();
  }, []);

  const featuredPost = allPosts[0];
  const trendingPosts = allPosts.slice(1, 4);
  const otherPosts = allPosts.slice(4);

  const postsByCategory = otherPosts.reduce((acc, post) => {
    const category = post.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(post);
    return acc;
  }, {} as Record<string, Post[]>);
  
  const categoryOrder = ['Web Development', 'AI', 'Social Media Marketing', 'Latest Trends'];

  const sortedCategories = Object.keys(postsByCategory).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
          <HomePageLoader />
      ) : (
        <>
          <section className="text-center my-12 md:my-16">
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white">
              Code. Create. Market. Automate.
              <br />
              <span className="text-primary">Stay Ahead with Artechway.</span>
            </h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              Your daily brief on Web Development, AI, and Social Media Marketing.
            </p>
          </section>

          {allPosts.length > 0 ? (
            <>
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {featuredPost && (
                        <div className="lg:col-span-2">
                            <h2 className="text-3xl font-headline mb-4 border-b-2 border-primary pb-2">
                                Top Story
                            </h2>
                            <BlogPostCard post={featuredPost} variant="featured" />
                        </div>
                    )}
                    {trendingPosts.length > 0 && (
                        <div className="lg:col-span-1 space-y-4">
                             <h2 className="text-3xl font-headline mb-4 border-b-2 border-primary pb-2">
                                Trending
                            </h2>
                            <div className="flex flex-col gap-4">
                                {trendingPosts.map(post => (
                                    <BlogPostCard key={post.slug} post={post} variant="compact" />
                                ))}
                            </div>
                        </div>
                    )}
                </section>
                
                <div className="space-y-16">
                  {sortedCategories.map(category => (
                    postsByCategory[category] && postsByCategory[category].length > 0 && (
                        <section key={category}>
                            <h2 className="text-3xl font-headline mb-6 border-b-2 border-primary pb-2">
                            {category}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {postsByCategory[category].map(post => (
                                <BlogPostCard key={post.slug} post={post} />
                            ))}
                            </div>
                        </section>
                    )
                  ))}
                </div>
            </>
          ) : (
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
