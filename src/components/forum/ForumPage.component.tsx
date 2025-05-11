'use client';

import { useState } from 'react';
import { MagnifyingGlass, GridFour, List } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PostList } from './PostList.component';
import { PostQueryParams } from '@/types/forum.types';

export function ForumPage() {
  // State for view mode (grid/list)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<PostQueryParams['sortBy']>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Query parameters for the PostList
  const queryParams: PostQueryParams = {
    search: searchQuery,
    category: category === 'all' ? undefined : category,
    sortBy,
    sortOrder,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
        <p className="text-muted-foreground">
          Join the discussion and share your expertise with the community
        </p>
      </div>

      {/* Search and Filters Section */}
      <div className="space-y-4 mb-8">
        {/* Search Bar */}
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            type="search"
            placeholder="Search posts..."
            className="pl-10"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={sortBy} 
            onValueChange={(value) => setSortBy(value as PostQueryParams['sortBy'])}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Date</SelectItem>
              <SelectItem value="likes_count">Likes</SelectItem>
              <SelectItem value="comment_count">Comments</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="w-full sm:w-auto"
          >
            {sortOrder === 'asc' ? '↑' : '↓'} Sort
          </Button>

          <div className="flex gap-2 ml-auto">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
              className="w-10 h-10 p-0"
            >
              <GridFour size={20} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              className="w-10 h-10 p-0"
            >
              <List size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <PostList viewMode={viewMode} queryParams={queryParams} />
    </div>
  );
} 