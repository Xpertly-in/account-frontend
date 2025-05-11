import { Metadata } from 'next';
import { ForumPage } from '@/components/forum/ForumPage.component';

export const metadata: Metadata = {
  title: 'Forum | Xpertly',
  description: 'Join the Xpertly community forum to discuss, share, and learn from other professionals.',
  keywords: 'forum, community, discussion, xpertly',
};

export default function Forum() {
  return <ForumPage />;
} 