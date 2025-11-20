import { render, screen } from '@testing-library/react';
import PostCard from '../PostCard';
import { Post } from '@/types/post';

const mockPost: Post = {
  id: '1',
  title: 'Test Post',
  slug: 'test-post',
  content: 'This is a test post content',
  excerpt: 'Test excerpt',
  coverImage: 'https://example.com/image.jpg',
  status: 'PUBLISHED',
  publishedAt: '2024-01-01T00:00:00Z',
  authorId: 'author1',
  author: {
    id: 'author1',
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://example.com/avatar.jpg',
  },
  tags: [
    { id: 'tag1', name: 'Technology', slug: 'technology' },
    { id: 'tag2', name: 'Programming', slug: 'programming' },
  ],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('PostCard', () => {
  it('renders post information correctly', () => {
    render(<PostCard post={mockPost} />);
    
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Test excerpt')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Programming')).toBeInTheDocument();
  });

  it('renders author avatar when available', () => {
    render(<PostCard post={mockPost} />);
    
    const avatar = screen.getByAltText('John Doe');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('renders author initial when no avatar', () => {
    const postWithoutAvatar = {
      ...mockPost,
      author: {
        ...mockPost.author!,
        image: null,
      },
    };
    
    render(<PostCard post={postWithoutAvatar} />);
    
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('renders cover image when available', () => {
    render(<PostCard post={mockPost} />);
    
    const coverImage = screen.getByAltText('Test Post');
    expect(coverImage).toBeInTheDocument();
  });

  it('calculates reading time correctly', () => {
    render(<PostCard post={mockPost} />);
    
    expect(screen.getByText(/min read/)).toBeInTheDocument();
  });

  it('renders published date', () => {
    render(<PostCard post={mockPost} />);
    
    expect(screen.getByText('1/1/2024')).toBeInTheDocument();
  });
});