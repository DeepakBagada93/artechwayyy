
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/layout/header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn !== 'true') {
        router.replace('/login');
      } else {
        setIsChecking(false);
      }
    }
  }, [router]);

  if (isChecking) {
    return (
        <>
            <Header />
            <div className="flex h-[calc(100vh-5rem)] w-full items-center justify-center">
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
        </>
    );
  }

  return (
    <>
        <Header />
        <div className="flex flex-1">
            {children}
        </div>
    </>
    );
}
