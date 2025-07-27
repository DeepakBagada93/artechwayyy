
'use server';

import { supabase } from '@/lib/supabaseClient';

export async function getRelatedPosts(currentPostSlug: string): Promise<{ title: string; slug: string }[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('title, slug')
    .not('slug', 'eq', currentPostSlug)
    .limit(3);

  if (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
  
  return data || [];
}
