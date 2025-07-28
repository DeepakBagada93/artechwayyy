
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, notFound, useParams } from 'next/navigation';
import { Post } from '@/lib/data';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Home, LogOut, PlusSquare, Settings, User } from 'lucide-react';
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
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().min(1, 'Tags are required'),
  image: z.any(),
});

type PostFormValues = z.infer<typeof postSchema>;

const categories = ['Web Development', 'AI', 'Social Media Marketing', 'Latest Trends'];

interface AdminUser {
    id: string;
    email: string;
    name: string;
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { toast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setCurrentUser(JSON.parse(userStr));
        }
    }
  }, []);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
        title: '',
        content: '',
        author: '',
        category: '',
        tags: '',
        image: null,
    },
  });

  useEffect(() => {
    const fetchPost = async () => {
      if (!supabase || !slug) {
        setIsLoading(false);
        return;
      };
      setIsLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error || !data) {
        console.error('Error fetching post for editing:', error);
        notFound();
      } else {
        const fetchedPost = data as Post;
        setPost(fetchedPost);
        form.reset({
          title: fetchedPost.title,
          content: fetchedPost.content,
          author: fetchedPost.author,
          category: fetchedPost.category,
          tags: fetchedPost.tags.join(', '),
          image: fetchedPost.image,
        });
        setPreviewImage(fetchedPost.image);
      }
      setIsLoading(false);
    };
    fetchPost();
  }, [slug, form]);
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('image', event.target.files);
    } else if (post) {
      setPreviewImage(post.image);
      form.setValue('image', post.image);
    }
  };

  const onSubmit = async (data: PostFormValues) => {
    if (!post || !supabase) return;

    let imageUrl = post.image;
    // Check if a new image file was uploaded
    if (data.image && typeof data.image !== 'string') {
        const imageFile = data.image[0] as File;
        const imagePath = `${post.slug}-${Date.now()}-${imageFile.name}`;

        const { data: imageData, error: imageError } = await supabase.storage
            .from('posts')
            .upload(imagePath, imageFile, { upsert: true });

        if (imageError) {
            console.error('Image update error:', imageError);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to update image.' });
            return;
        }

        const { data: publicUrlData } = supabase.storage
            .from('posts')
            .getPublicUrl(imageData.path);
        imageUrl = publicUrlData.publicUrl;
    }

    const postData = {
        title: data.title,
        content: data.content,
        author: data.author,
        category: data.category,
        tags: data.tags.split(',').map(tag => tag.trim()),
        image: imageUrl,
        excerpt: data.content.substring(0, 150) + '...',
    };

    const { error: postError } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', post.id);

    if (postError) {
        console.error('Post update error:', postError);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update post.' });
    } else {
        toast({
            title: 'Post Updated!',
            description: 'The blog post has been successfully updated.',
        });
        router.push('/admin/manage');
        router.refresh(); // To show updated data on manage page
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
    }
    router.push('/login');
  }

  if (isLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="space-y-4 w-full max-w-2xl p-8">
                <Skeleton className="h-12 w-1/2" />
                <Skeleton className="h-8 w-1/4" />
                <div className="space-y-2 pt-8">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </div>
    );
  }

  if (!post) {
      return notFound();
  }

  return (
    <div className="flex-1">
        <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
            <h2 className="text-xl font-bold px-2">Dashboard</h2>
            </SidebarHeader>
            <SidebarContent>
            <SidebarMenu style={{ marginTop: '100px' }}>
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
            <SidebarFooter>
                <div className="flex items-center gap-2 p-2">
                    <Avatar>
                        <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-sm">
                        <span className="font-semibold">{currentUser?.name ?? 'Admin'}</span>
                        <span className="text-muted-foreground">{currentUser?.email ?? 'admin@example.com'}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-auto" onClick={handleLogout}>
                        <LogOut />
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <div className="container mx-auto px-4 py-8" style={{ marginTop: '100px' }}>
                <div className="flex items-center mb-8 gap-4">
                    <SidebarTrigger />
                    <h1 className="font-headline text-4xl font-bold tracking-tighter text-white">
                        Edit Post
                    </h1>
                </div>
                <Card>
                    <CardHeader>
                    <CardTitle>Editing &quot;{post.title}&quot;</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                <Textarea
                                    {...field}
                                    rows={15}
                                    className="bg-background/50"
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        <Input type="file" accept="image/*" onChange={handleImageChange} />
                                    </FormControl>
                                    {previewImage && (
                                    <div className="mt-4 relative aspect-video w-full max-w-md overflow-hidden rounded-lg">
                                        <Image src={previewImage} alt="Image preview" fill className="object-cover" />
                                    </div>
                                    )}
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                        <FormField
                            control={form.control}
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
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categories.map((category) => (
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
                            control={form.control}
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

                        <div className="flex gap-2">
                            <Button type="submit">Update Post</Button>
                            <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push('/admin/manage')}
                            >
                            Cancel
                            </Button>
                        </div>
                        </form>
                    </Form>
                    </CardContent>
                </Card>
            </div>
        </SidebarInset>
        </SidebarProvider>
    </div>
  );
}
