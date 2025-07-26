
'use server';

import { POSTS } from '@/lib/data';

export async function getRelatedPosts(currentPostSlug: string): Promise<{ title: string; slug: string }[]> {
  // Simple logic to get some posts, excluding the current one.
  // In a real app, this would be a more sophisticated recommendation logic.
  return POSTS
    .filter(post => post.slug !== currentPostSlug)
    .slice(0, 3)
    .map(post => ({ title: post.title, slug: post.slug }));
}
