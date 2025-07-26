'use server';

import { suggestRelatedPosts, type SuggestRelatedPostsInput } from '@/ai/flows/suggest-related-posts';
import { generateBlogPost, type GenerateBlogPostInput, type GenerateBlogPostOutput } from '@/ai/flows/generate-blog-post';
import { generateBlogImage, type GenerateBlogImageInput, type GenerateBlogImageOutput } from '@/ai/flows/generate-blog-image';
import { POSTS } from '@/lib/data';

export async function getRelatedPosts(input: SuggestRelatedPostsInput): Promise<{ title: string; slug: string }[]> {
  try {
    const relatedTitles = await suggestRelatedPosts(input);
    const relatedPosts = POSTS
      .filter(post => relatedTitles.includes(post.title))
      .map(post => ({ title: post.title, slug: post.slug }));
    return relatedPosts;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    // In case of an AI error, return an empty array to prevent crashing the page.
    return [];
  }
}

export async function generateBlogPostAction(input: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> {
  try {
    return await generateBlogPost(input);
  } catch (error) {
    console.error('Error generating blog post:', error);
    // In case of an AI error, return an empty content to prevent crashing the page.
    return { content: '' };
  }
}

export async function generateBlogImageAction(input: GenerateBlogImageInput): Promise<GenerateBlogImageOutput> {
    try {
        return await generateBlogImage(input);
    } catch (error) {
        console.error('Error generating blog image:', error);
        return { imageUrl: '' };
    }
}
