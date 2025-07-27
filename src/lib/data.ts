
export interface Post {
  id: number;
  slug: string;
  title: string;
  author: string;
  date: string;
  image: string;
  dataAiHint: string;
  excerpt: string;
  content: string;
  tags: string[];
  category: string;
}
