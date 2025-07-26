'use server';

/**
 * @fileOverview A Genkit flow for generating a blog post image.
 *
 * - generateBlogImage - A function that generates an image based on the blog post title and content.
 * - GenerateBlogImageInput - The input type for the generateBlogImage function.
 * - GenerateBlogImageOutput - The return type for the generateBlogImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogImageInputSchema = z.object({
  title: z.string().describe('The title of the blog post.'),
  content: z.string().describe('The content of the blog post.'),
});
export type GenerateBlogImageInput = z.infer<typeof GenerateBlogImageInputSchema>;

const GenerateBlogImageOutputSchema = z.object({
    imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateBlogImageOutput = z.infer<typeof GenerateBlogImageOutputSchema>;

export async function generateBlogImage(input: GenerateBlogImageInput): Promise<GenerateBlogImageOutput> {
  return generateBlogImageFlow(input);
}

const generateBlogImageFlow = ai.defineFlow(
  {
    name: 'generateBlogImageFlow',
    inputSchema: GenerateBlogImageInputSchema,
    outputSchema: GenerateBlogImageOutputSchema,
  },
  async ({ title, content }) => {
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `Generate a high-quality, visually appealing blog post header image for an article titled "${title}". The article is about: ${content.substring(0, 200)}... The image should be abstract and artistic, suitable for a tech blog. Do not include any text in the image.`,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    if (!media.url) {
        throw new Error('Image generation failed.');
    }

    return { imageUrl: media.url };
  }
);
