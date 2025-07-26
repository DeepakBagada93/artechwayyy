'use client';

import { useState, useMemo } from 'react';
import { POSTS } from '@/lib/data';
import { BlogPostCard } from '@/components/blog-post-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    POSTS.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
    return ['all', ...Array.from(tags)];
  }, []);

  const filteredPosts = useMemo(() => {
    let posts = POSTS;

    if (selectedTag !== 'all') {
      posts = posts.filter((post) => post.tags.includes(selectedTag));
    }

    if (searchTerm) {
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return posts;
  }, [searchTerm, selectedTag]);

  const mainStory = filteredPosts[0];
  const topStories = filteredPosts.slice(1, 5);
  const otherStories = filteredPosts.slice(5);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-8">
        <h1 className="font-headline text-5xl font-bold tracking-tighter text-white">
          The Artechway
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Your daily brief on Web Development, AI, and Social Media Marketing.
          Stay ahead of the curve with expert insights and analysis.
        </p>
      </section>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search articles..."
            className="pl-10 h-12 text-base w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag === 'all' ? 'All Topics' : tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

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
