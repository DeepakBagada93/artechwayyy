
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Post } from '@/lib/data';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Home, PlusSquare, Settings, Trash2, FilePenLine, LogOut, User } from 'lucide-react';
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
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface AdminUser {
    id: string;
    email: string;
    name: string;
}

export default function ManagePostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setCurrentUser(JSON.parse(userStr));
        }
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
        if (!supabase) return;
        const { data, error } = await supabase.from('posts').select('*').order('date', { ascending: false });
        if (error) {
            console.error('Error fetching posts:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch posts.' });
        } else {
            setPosts(data as Post[]);
        }
    };
    fetchPosts();
  }, [toast]);


  const handleDelete = async () => {
    if (!postToDelete || !supabase) return;
    
    const { error } = await supabase.from('posts').delete().eq('id', postToDelete.id);

    if (error) {
        console.error('Error deleting post:', error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: `Failed to delete "${postToDelete.title}".`,
        });
    } else {
        setPosts(posts.filter((p) => p.id !== postToDelete.id));
        toast({
          title: 'Post Deleted',
          description: `The post "${postToDelete.title}" has been deleted.`,
        });
    }
    setPostToDelete(null);
  };
  
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
    }
    router.push('/login');
  }

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
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <SidebarTrigger />
            <h1 className="font-headline text-4xl font-bold tracking-tighter text-white ml-4">
              Manage Posts
            </h1>
          </div>
          <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>All Blog Posts</CardTitle>
                    <Button asChild>
                        <Link href="/admin">
                            <PlusSquare className="mr-2 h-4 w-4" />
                            Create New Post
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.slug}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.author}</TableCell>
                      <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/edit/${post.slug}`}>
                            <FilePenLine className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setPostToDelete(post)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently
                                delete the post titled &quot;{post.title}&quot;.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setPostToDelete(null)}>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
