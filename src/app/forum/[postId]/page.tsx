import { Metadata } from 'next';
import { PostDetail } from '@/components/forum/PostDetail.component';

export const metadata: Metadata = {
  title: 'Post | Xpertly Forum',
  description: 'View and interact with forum posts on Xpertly.',
  keywords: 'forum, post, discussion, xpertly',
};

export default function PostPage({ params }: { params: { postId: string } }) {
  return <PostDetail postId={params.postId} />;
} 