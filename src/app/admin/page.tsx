
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { supabase } from '@/lib/supabaseClient';
import { Textarea } from '@/components/ui/textarea';


const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().min(1, 'Tags are required'),
  image: z.any().refine(files => files?.length === 1, 'Image is required.'),
});

type PostFormValues = z.infer<typeof postSchema>;

const categories = ['Web Development', 'AI', 'Social Media Marketing', 'Latest Trends'];

function generateSlug(title: string) {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

interface AdminUser {
    id: string;
    email: string;
    name: string;
}

export default function AdminPage() {
  const { toast } = useToast();
  const router = useRouter();
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
      image: undefined,
    },
  });

  useEffect(() => {
    if (currentUser) {
        form.setValue('author', currentUser.name);
    }
  }, [currentUser, form]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('image', event.target.files);
    } else {
        setPreviewImage(null);
        form.setValue('image', null);
    }
  };


  const onSubmit = async (data: PostFormValues) => {
    if (!supabase) {
        toast({ variant: 'destructive', title: 'Error', description: 'Supabase client is not initialized.' });
        return;
    }

    const imageFile = data.image[0] as File;
    const slug = generateSlug(data.title);
    const imagePath = `${slug}-${imageFile.name}`;

    // 1. Upload image to Supabase Storage
    const { data: imageData, error: imageError } = await supabase.storage
        .from('posts')
        .upload(imagePath, imageFile);

    if (imageError) {
        console.error('Image upload error:', imageError);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to upload image.' });
        return;
    }
    
    // 2. Get public URL for the uploaded image
    const { data: publicUrlData } = supabase.storage
        .from('posts')
        .getPublicUrl(imageData.path);
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data.content;
    const plainTextContent = tempDiv.textContent || tempDiv.innerText || '';

    // 3. Insert post data into the database
    const postData = {
        title: data.title,
        content: data.content,
        author: data.author,
        category: data.category,
        tags: data.tags.split(',').map(tag => tag.trim()),
        slug: slug,
        image: publicUrlData.publicUrl,
        excerpt: plainTextContent.substring(0, 150) + '...',
    };

    const { error: postError } = await supabase.from('posts').insert([postData]);

    if (postError) {
        console.error('Post creation error:', postError);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to create post.' });
    } else {
        toast({
          title: 'Post Created!',
          description: 'The new blog post has been successfully created.',
        });
        form.reset();
        setPreviewImage(null);
        router.push('/admin/manage');
    }
  };
  
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
    }
    router.push('/login');
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
                        Create New Post
                    </h1>
                </div>
            <Card>
                <CardHeader>
                <CardTitle>Create New Blog Post</CardTitle>
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
                            <Input placeholder="Enter a catchy title" {...field} />
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
                                    placeholder="Write your blog post here... You can use Markdown for formatting."
                                    rows={15}
                                    className="bg-background/50"
                                    {...field}
                                />
                            </FormControl>
                             <FormDescription>
                                To add a link, use Markdown: `[link text](https://example.com)`
                            </FormDescription>
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

                    <Button type="submit">Create Post</Button>
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
