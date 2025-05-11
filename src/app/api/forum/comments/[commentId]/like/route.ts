import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(
  request: Request,
  { params }: { params: { commentId: string } }
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

    // Create like
    const { error } = await supabase
      .from('likes')
      .insert({
        user_id: session.user.id,
        target_id: parseInt(params.commentId),
        target_type: 'comment',
      });

    if (error) throw error;

    // Increment comment likes count
    await supabase.rpc('increment_like_count', {
      comment_id: parseInt(params.commentId),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error liking comment:', error);
    return NextResponse.json(
      { error: 'Failed to like comment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { commentId: string } }
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

    // Remove like
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', session.user.id)
      .eq('target_id', parseInt(params.commentId))
      .eq('target_type', 'comment');

    if (error) throw error;

    // Decrement comment likes count
    await supabase.rpc('decrement_like_count', {
      comment_id: parseInt(params.commentId),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unliking comment:', error);
    return NextResponse.json(
      { error: 'Failed to unlike comment' },
      { status: 500 }
    );
  }
} 