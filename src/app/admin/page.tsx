
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateBlogPostAction, generateBlogImageAction } from '../actions';
import { Wand2, Home, PlusSquare, Settings, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().min(1, 'Tags are required'),
  image: z.string().url('A valid image URL is required.'),
});

type PostFormValues = z.infer<typeof postSchema>;

const categories = ['Web Development', 'AI', 'Social Media', 'Design', 'SEO'];

export default function AdminPage() {
  const { toast } = useToast();
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      author: 'Deepak Bagada',
      category: '',
      tags: '',
      image: '',
    },
  });

  const { handleSubmit, control, watch, setValue, getValues } = form;
  const title = watch('title');
  const content = watch('content');
  const imageUrl = watch('image');

  const handleGenerateContent = async () => {
    if (!title) {
      toast({
        title: 'Title is required',
        description: 'Please enter a title to generate content.',
        variant: 'destructive',
      });
      return;
    }
    setIsGeneratingContent(true);
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
      setIsGeneratingContent(false);
    }
  };

  const handleGenerateImage = async () => {
    const { title, content } = getValues();
    if (!title || !content) {
      toast({
        title: 'Title and content are required',
        description: 'Please enter a title and content to generate an image.',
        variant: 'destructive',
      });
      return;
    }
    setIsGeneratingImage(true);
    try {
      const result = await generateBlogImageAction({ title, content });
      if (result.imageUrl) {
        setValue('image', result.imageUrl, { shouldValidate: true });
        toast({
          title: 'Image Generated',
          description: 'The blog post image has been successfully generated.',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to generate image. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while generating the image.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingImage(false);
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
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
           <h2 className="text-xl font-bold px-2">Dashboard</h2>
        </SidebarHeader>
        <SidebarContent>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href="/admin">
                            <PlusSquare />
                            <span>Create Post</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href="/admin/manage">
                            <Settings />
                            <span>Manage Posts</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarSeparator />
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href="/">
                            <Home />
                            <span>View Blog</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-8">
                <SidebarTrigger />
                 <h1 className="font-headline text-4xl font-bold tracking-tighter text-white ml-4">
                    Create New Post
                </h1>
            </div>
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
                        disabled={isGeneratingContent || !title}
                      >
                        <Wand2 className="mr-2 h-4 w-4" />
                        {isGeneratingContent ? 'Generating...' : 'Generate with AI'}
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
                    <FormMessage>
                      {form.formState.errors.content?.message}
                    </FormMessage>
                  </FormItem>

                   <FormItem>
                    <div className="flex justify-between items-center mb-2">
                      <FormLabel>Image</FormLabel>
                       <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleGenerateImage}
                        disabled={isGeneratingImage || !title || !content}
                      >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        {isGeneratingImage ? 'Generating...' : 'Generate with AI'}
                      </Button>
                    </div>
                     <FormControl>
                       <Input {...form.register('image')} placeholder="Image URL will appear here" />
                    </FormControl>
                     {imageUrl && (
                      <div className="mt-4 relative aspect-video w-full max-w-md overflow-hidden rounded-lg">
                        <Image src={imageUrl} alt="Generated blog post image" fill className="object-cover" />
                      </div>
                    )}
                    <FormMessage>{form.formState.errors.image?.message}</FormMessage>
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map(category => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                          <Input
                            placeholder="e.g., AI, Web Development, React"
                            {...field}
                          />
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
      </SidebarInset>
    </SidebarProvider>
  );
}
