
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { Skeleton } from './ui/skeleton';

const ReactQuill = dynamic(() => import('react-quill'), { 
    ssr: false,
    loading: () => <Skeleton className="h-[250px] w-full" />,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'link',
];

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <Skeleton className="h-[250px] w-full" />;
    }
    
  return (
    <div className={className}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="bg-background/50 [&_.ql-editor]:min-h-[250px]"
      />
    </div>
  );
}
