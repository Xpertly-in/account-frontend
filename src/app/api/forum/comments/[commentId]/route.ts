import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

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

    // Get comment to check ownership
    const { data: comment, error: fetchError } = await supabase
      .from('comments')
      .select('*')
      .eq('id', params.commentId)
      .single();

    if (fetchError) throw fetchError;

    // Check if user is the author
    if (comment.author_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Soft delete comment
    const { error: deleteError } = await supabase
      .from('comments')
      .update({ is_deleted: true })
      .eq('id', params.commentId);

    if (deleteError) throw deleteError;

    // Update post comment count
    await supabase.rpc('decrement_comment_count', {
      post_id: comment.post_id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
} 