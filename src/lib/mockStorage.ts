// Shared mock storage for posts across API routes
export let mockPosts: any[] = [];

export function addMockPost(post: any) {
  mockPosts.push(post);
}

export function removeMockPost(postId: string) {
  const index = mockPosts.findIndex(post => post.id === postId);
  if (index > -1) {
    mockPosts.splice(index, 1);
    return true;
  }
  return false;
}

export function getMockPosts() {
  return mockPosts;
}