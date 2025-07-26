'use client';

import { useState } from 'react';
import type { Comment } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CommentsProps {
  initialComments: Comment[];
}

export function Comments({ initialComments }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const newCommentData: Comment = {
        id: comments.length + 1,
        author: 'Guest User',
        avatar: 'https://placehold.co/40x40',
        dataAiHint: 'person avatar',
        date: new Date().toISOString(),
        content: newComment,
      };
      setComments([newCommentData, ...comments]);
      setNewComment('');
    }
  };

  return (
    <Card className="bg-transparent border-0 shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="font-headline text-3xl text-white">
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <form onSubmit={handleSubmit} className="mb-8">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-4 bg-background/50 border-border/50 text-base"
            rows={4}
          />
          <Button type="submit" disabled={!newComment.trim()}>
            Post Comment
          </Button>
        </form>

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={comment.avatar} alt={comment.author} data-ai-hint={comment.dataAiHint} />
                <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-white">{comment.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <p className="text-foreground/90">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
