// Shared mock storage for posts using localStorage
const POSTS_KEY = 'mockPosts';

function loadPosts(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(POSTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function savePosts(posts: any[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export let mockPosts: any[] = loadPosts();

export function addMockPost(post: any) {
  mockPosts = loadPosts();
  mockPosts.push(post);
  savePosts(mockPosts);
}

export function removeMockPost(postId: string) {
  mockPosts = loadPosts();
  const index = mockPosts.findIndex(post => post.id === postId);
  if (index > -1) {
    mockPosts.splice(index, 1);
    savePosts(mockPosts);
    return true;
  }
  return false;
}

export function getMockPosts() {
  return loadPosts();
}