import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { CreateCommentInput } from '@/types/forum.types';

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    // const cookieStore = cookies();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: comments, error } = await supabase
      .from('comments')
      .select('*, replies:comments(*)')
      .eq('post_id', params.postId)
      .is('parent_id', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Get user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: CreateCommentInput = await request.json();
    const { content, parentId } = body;

    // Create comment
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        content,
        post_id: parseInt(params.postId),
        author_id: session.user.id,
        parent_id: parentId || null,
      })
      .select()
      .single();

    if (error) throw error;

    // Update post comment count
    await supabase.rpc('increment_comment_count', {
      post_id: parseInt(params.postId),
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
} 