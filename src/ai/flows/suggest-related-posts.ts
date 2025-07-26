'use server';

/**
 * @fileOverview This file implements the Genkit flow for suggesting related blog posts.
 *
 * - suggestRelatedPosts - A function that suggests related blog posts based on the content of the current article.
 * - SuggestRelatedPostsInput - The input type for the suggestRelatedPosts function.
 * - SuggestRelatedPostsOutput - The return type for the suggestRelatedPosts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelatedPostsInputSchema = z.object({
  currentArticleContent: z
    .string()
    .describe('The full content of the current blog article.'),
  availablePosts: z.array(z.string()).describe('A list of available blog post titles.'),
});
export type SuggestRelatedPostsInput = z.infer<typeof SuggestRelatedPostsInputSchema>;

const SuggestRelatedPostsOutputSchema = z.array(z.string()).describe('A list of related blog post titles.');
export type SuggestRelatedPostsOutput = z.infer<typeof SuggestRelatedPostsOutputSchema>;

export async function suggestRelatedPosts(input: SuggestRelatedPostsInput): Promise<SuggestRelatedPostsOutput> {
  return suggestRelatedPostsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelatedPostsPrompt',
  input: {schema: SuggestRelatedPostsInputSchema},
  output: {schema: SuggestRelatedPostsOutputSchema},
  prompt: `You are a blog post recommendation expert.

  Given the content of the current article and a list of available blog post titles, you will suggest related blog posts that the user might be interested in.
  Consider the content of the current article and the titles of the available posts to determine which posts are most relevant.
  Return ONLY a list of the titles of the related blog posts. Do not include any other information. Do not explain your reasoning.

Current Article Content:
{{currentArticleContent}}

Available Posts:
{{#each availablePosts}}- {{{this}}}\n{{/each}}`,
});

const suggestRelatedPostsFlow = ai.defineFlow(
  {
    name: 'suggestRelatedPostsFlow',
    inputSchema: SuggestRelatedPostsInputSchema,
    outputSchema: SuggestRelatedPostsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
