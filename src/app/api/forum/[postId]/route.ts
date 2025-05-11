import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { UpdatePostInput } from '../../../../types/forum.types';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/forum/[postId] - Get a single post
export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', params.postId)
      .eq('is_deleted', false)
      .single();

    if (error) throw error;
    if (!post) {
      return NextResponse.json(
        { data: null, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: post, error: null });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { data: null, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT /api/forum/[postId] - Update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const body: UpdatePostInput = await request.json();

    // Get the current user from the session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if the post exists and belongs to the user
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', params.postId)
      .eq('is_deleted', false)
      .single();

    if (fetchError || !existingPost) {
      return NextResponse.json(
        { data: null, error: 'Post not found' },
        { status: 404 }
      );
    }

    if (existingPost.author_id !== user.id) {
      return NextResponse.json(
        { data: null, error: 'Unauthorized to update this post' },
        { status: 403 }
      );
    }

    // Update the post
    const { data: post, error } = await supabase
      .from('posts')
      .update({
        title: body.title,
        content: body.content,
        category: body.category,
        tags: body.tags,
        images: body.images,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.postId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data: post, error: null });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { data: null, error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/forum/[postId] - Soft delete a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    // Get the current user from the session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if the post exists and belongs to the user
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', params.postId)
      .eq('isDeleted', false)
      .single();

    if (fetchError || !existingPost) {
      return NextResponse.json(
        { data: null, error: 'Post not found' },
        { status: 404 }
      );
    }

    if (existingPost.author_id !== user.id) {
      return NextResponse.json(
        { data: null, error: 'Unauthorized to delete this post' },
        { status: 403 }
      );
    }

    // Soft delete the post
    const { error } = await supabase
      .from('posts')
      .update({ isDeleted: true })
      .eq('id', params.postId);

    if (error) throw error;

    return NextResponse.json({ data: null, error: null });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { data: null, error: 'Failed to delete post' },
      { status: 500 }
    );
  }
} 