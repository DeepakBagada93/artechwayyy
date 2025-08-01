
'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { Home, PlusSquare, Settings, Trash2, FilePenLine, LogOut, User, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdminUser {
    id: string;
    email: string;
    name: string;
}

const POSTS_PER_PAGE = 10;

export default function ManagePostsPage() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setCurrentUser(JSON.parse(userStr));
        }
    }
  }, []);

  useEffect(() => {
    const fetchPostsAndCategories = async () => {
        if (!supabase) return;
        setIsLoading(true);
        const { data, error } = await supabase.from('posts').select('*').order('date', { ascending: false });
        
        if (error) {
            console.error('Error fetching posts:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch posts.' });
        } else {
            setAllPosts(data as Post[]);
            const uniqueCategories = [...new Set(data.map(p => p.category).filter(Boolean))].sort() as string[];
            setCategories(uniqueCategories);
        }
        setIsLoading(false);
    };
    fetchPostsAndCategories();
  }, [toast]);

  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
  }, [allPosts, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);


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
        setAllPosts(allPosts.filter((p) => p.id !== postToDelete.id));
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
                         <div className="flex items-center gap-4 mt-4">
                            <Input
                                placeholder="Search by title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-sm"
                            />
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead className="hidden md:table-cell">Category</TableHead>
                            <TableHead className="hidden md:table-cell">Author</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                         {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Loading posts...
                                </TableCell>
                            </TableRow>
                        ) : paginatedPosts.length > 0 ? (
                            paginatedPosts.map((post) => (
                                <TableRow key={post.slug}>
                                <TableCell className="font-medium max-w-[250px] truncate">{post.title}</TableCell>
                                <TableCell className="hidden md:table-cell">{post.category}</TableCell>
                                <TableCell className="hidden md:table-cell">{post.author}</TableCell>
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
                            ))
                        ) : (
                             <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No posts found.
                                </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                     <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                           <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                        </Button>
                         <span className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                    </CardContent>
                </Card>
            </div>
        </SidebarInset>
        </SidebarProvider>
    </div>
  );
}
