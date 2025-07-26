'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { generateBlogPostAction } from '../actions';
import { Wand2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';


const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
  tags: z.string().min(1, 'Tags are required'),
});

type PostFormValues = z.infer<typeof postSchema>;

export default function AdminPage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      author: 'Admin',
      tags: '',
    },
  });

  const { handleSubmit, control, watch, setValue } = form;
  const title = watch('title');

  const handleGenerateContent = async () => {
    if (!title) {
      toast({
        title: 'Title is required',
        description: 'Please enter a title to generate content.',
        variant: 'destructive',
      });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateBlogPostAction({ title });
      if (result.content) {
        setValue('content', result.content, { shouldValidate: true });
        toast({
          title: 'Content Generated',
          description: 'The blog post content has been successfully generated.',
        });
      } else {
         toast({
          title: 'Error',
          description: 'Failed to generate content. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
       toast({
        title: 'Error',
        description: 'An unexpected error occurred while generating content.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = (data: PostFormValues) => {
    console.log('Creating post:', data);
    // Here you would typically send the data to your backend to save the post
    toast({
      title: 'Post Created!',
      description: 'The new blog post has been successfully created (simulation).',
    });
    form.reset();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-4xl font-bold tracking-tighter text-white mb-8">
        Admin Dashboard
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Create New Blog Post</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a catchy title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <div className="flex justify-between items-center mb-2">
                  <FormLabel>Content</FormLabel>
                   <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerateContent}
                    disabled={isGenerating || !title}
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                  </Button>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Write your blog post here, or generate it with AI."
                    {...form.register('content')}
                    rows={15}
                    className="bg-background/50"
                  />
                </FormControl>
                 <FormMessage>{form.formState.errors.content?.message}</FormMessage>
              </FormItem>
              
               <FormField
                control={control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., AI, Web Development, React" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter tags separated by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Create Post</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
