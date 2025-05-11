'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Mock data for testing
const mockPosts = [
  {
    id: 1,
    title: 'Getting Started with Xpertly',
    content: 'Learn how to make the most of Xpertly...',
    author: 'John Doe',
    likes: 42,
    comments: 12,
    category: 'General',
    tags: ['beginner', 'guide'],
  },
  {
    id: 2,
    title: 'Best Practices for Account Management',
    content: 'Here are some tips for managing your account...',
    author: 'Jane Smith',
    likes: 28,
    comments: 8,
    category: 'Account',
    tags: ['tips', 'management'],
  },
];

const mockComments = [
  {
    id: 1,
    author: 'Alice Johnson',
    content: 'Great post! This helped me a lot.',
    likes: 5,
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    author: 'Bob Wilson',
    content: 'I have a question about...',
    likes: 2,
    timestamp: '1 hour ago',
  },
];

export default function TestFlowPage() {
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [selectedPost, setSelectedPost] = useState<typeof mockPosts[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handlePostClick = (post: typeof mockPosts[0]) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSelectedPost(post);
      setCurrentView('detail');
      setIsLoading(false);
    }, 1000);
  };

  const handleBackToList = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCurrentView('list');
      setSelectedPost(null);
      setIsLoading(false);
    }, 500);
  };

  const handleLike = () => {
    if (selectedPost) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setSelectedPost({
          ...selectedPost,
          likes: selectedPost.likes + 1,
        });
        setIsLoading(false);
      }, 500);
    }
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setNewComment('');
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Forum Flow Test</h1>

      {/* Navigation */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={handleBackToList}
          disabled={currentView === 'list'}
        >
          Back to List
        </Button>
        <span className="text-muted-foreground">
          Current View: {currentView === 'list' ? 'Post List' : 'Post Detail'}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-8 w-1/4" />
        </div>
      ) : currentView === 'list' ? (
        // Post List View
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Forum Posts</h2>
            <Button variant="default">Create Post</Button>
          </div>

          <div className="grid gap-4">
            {mockPosts.map((post) => (
              <div
                key={post.id}
                className={cn(
                  "p-4 rounded-lg border hover:border-primary cursor-pointer transition-colors",
                  "bg-card text-card-foreground"
                )}
                onClick={() => handlePostClick(post)}
              >
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-muted-foreground mt-2">{post.content}</p>
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-sm text-muted-foreground">
                    By {post.author}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {post.likes} likes
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {post.comments} comments
                  </span>
                </div>
                <div className="flex gap-2 mt-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Post Detail View
        <div className="space-y-6">
          {selectedPost && (
            <>
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">{selectedPost.title}</h2>
                <p className="text-muted-foreground">
                  By {selectedPost.author} • {selectedPost.category}
                </p>
                <div className="prose max-w-none">
                  <p>{selectedPost.content}</p>
                </div>
                <div className="flex gap-2">
                  {selectedPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLike}
                    className="flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                    {selectedPost.likes}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleComment}
                    className="flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    {selectedPost.comments}
                  </Button>
                </div>
              </div>

              {/* Comments Section */}
              {showComments && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-xl font-semibold">Comments</h3>
                  <div className="space-y-4">
                    {mockComments.map((comment) => (
                      <div 
                        key={comment.id} 
                        className="p-4 rounded-lg border bg-card text-card-foreground"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{comment.author}</p>
                            <p className="text-sm text-muted-foreground">
                              {comment.timestamp}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            </svg>
                            {comment.likes}
                          </Button>
                        </div>
                        <p className="mt-2">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleCommentSubmit} className="mt-4">
                    <textarea
                      className="w-full p-2 border rounded-md bg-background text-foreground"
                      placeholder="Write a comment..."
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button 
                      type="submit" 
                      className="mt-2"
                      disabled={!newComment.trim()}
                    >
                      Post Comment
                    </Button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
} 