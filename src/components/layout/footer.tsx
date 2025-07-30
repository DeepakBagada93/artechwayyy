
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Github, Linkedin, Twitter } from 'lucide-react';

const generateSlug = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const socialLinks = [
  { icon: Twitter, href: '#', 'aria-label': 'Twitter' },
  { icon: Github, href: '#', 'aria-label': 'GitHub' },
  { icon: Linkedin, href: '#', 'aria-label': 'LinkedIn' },
];

const companyLinks = [
    { name: 'About Us', href: '#' },
    { name: 'Contact Us', href: '#' },
];

export function Footer() {
    const [categories, setCategories] = useState<{name: string, href: string}[]>([]);
    
    useEffect(() => {
        async function fetchCategories() {
            if (!supabase) return;
            
            const { data, error } = await supabase
                .from('posts')
                .select('category');
            
            if (error) {
                console.error("Error fetching categories for footer:", error);
                return;
            }
            
            const uniqueCategories = [...new Set(data.map(p => p.category).filter(Boolean))].sort() as string[];
            const links = uniqueCategories.map((category: string) => ({
                name: category,
                href: `/category/${generateSlug(category)}`
            }));
            setCategories(links);
        }
        
        fetchCategories();
    }, []);

    const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Placeholder for newsletter logic
        alert('Thank you for subscribing!');
        (e.target as HTMLFormElement).reset();
    }

    return (
        <footer className="mt-auto border-t border-border/20 bg-background/95">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Section 1: Branding & Social */}
                    <div className="md:col-span-4 flex flex-col items-start">
                        <Link href="/" className="mb-4">
                            <Image
                                src="/artechway.png"
                                alt="Artechway Logo"
                                width={120}
                                height={24}
                                data-ai-hint="logo tech"
                            />
                        </Link>
                        <p className="text-muted-foreground text-sm mb-4 max-w-xs">
                            Dive deep into the latest tech trends with Artechway. Expert analysis on AI, web development, and more.
                        </p>
                        <div className="flex gap-2">
                            {socialLinks.map((social) => (
                                <Button key={social['aria-label']} variant="ghost" size="icon" asChild>
                                    <Link href={social.href} aria-label={social['aria-label']}>
                                        <social.icon className="h-5 w-5" />
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Section 2: Navigation Links */}
                    <div className="md:col-span-5 grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold text-foreground mb-4">Categories</h3>
                            <ul className="space-y-2">
                                {categories.map(link => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-4">Company</h3>
                            <ul className="space-y-2">
                                {companyLinks.map(link => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    {/* Section 3: Newsletter */}
                    <div className="md:col-span-3">
                        <h3 className="font-semibold text-foreground mb-4">Stay Updated</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Get the latest articles and updates delivered to your inbox.
                        </p>
                        <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                            <Input type="email" placeholder="Enter your email" required className="flex-grow"/>
                            <Button type="submit">Subscribe</Button>
                        </form>
                    </div>
                </div>
            </div>
            <Separator className="bg-border/20" />
            <div className="container mx-auto px-4 md:px-6 py-6 text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Artechway. All rights reserved.</p>
            </div>
        </footer>
    );
}
