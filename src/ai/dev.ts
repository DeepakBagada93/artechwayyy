import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-related-posts.ts';
import '@/ai/flows/generate-blog-post.ts';
import '@/ai/flows/generate-blog-image.ts';
