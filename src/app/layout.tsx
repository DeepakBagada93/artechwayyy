
'use client';

import { useState, createContext, useContext, ReactNode } from 'react';
import Script from 'next/script';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';

interface LayoutContextType {
  isHeaderVisible: boolean;
  isFooterVisible: boolean;
  setIsHeaderVisible: (isVisible: boolean) => void;
  setIsFooterVisible: (isVisible: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}

function LayoutProvider({ children }: { children: ReactNode }) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(true);

  return (
    <LayoutContext.Provider value={{ isHeaderVisible, isFooterVisible, setIsHeaderVisible, setIsFooterVisible }}>
      {children}
    </LayoutContext.Provider>
  );
}

// Metadata would need to be moved to a client component that can consume the context,
// or we can accept that it's static. For now, let's leave it, but this is a limitation
// of this approach if we wanted dynamic titles during loading.
// export const metadata: Metadata = {
//   title: 'Artechway',
//   description: 'Dive deep into the latest tech trends with Artechway. Our blog offers expert analysis on AI, web development, social media marketing, and the future of digital innovation.',
//   icons: {
//     icon: '/artechway.png',
//     apple: '/artechway.png',
//   }
// };


function AppLayout({ children }: { children: React.ReactNode }) {
  const { isHeaderVisible, isFooterVisible } = useLayout();
  return (
      <body className="font-body antialiased flex flex-col min-h-screen">
        {isHeaderVisible && <Header />}
        <main className="flex-grow">{children}</main>
        {isFooterVisible && <Footer />}
        <Toaster />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-50TBS7Y2ZM"></Script>
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-50TBS7Y2ZM');
          `}
        </Script>
      </body>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
       <head>
        <title>Artechway</title>
        <meta name="description" content="Dive deep into the latest tech trends with Artechway. Our blog offers expert analysis on AI, web development, social media marketing, and the future of digital innovation." />
        <link rel="icon" href="/artechway.png" />
        <link rel="apple-touch-icon" href="/artechway.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <LayoutProvider>
        <AppLayout>{children}</AppLayout>
      </LayoutProvider>
    </html>
  );
}
