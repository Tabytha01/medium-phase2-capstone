import fs from 'fs';
import path from 'path';

const POSTS_FILE = path.join(process.cwd(), 'data', 'posts.json');

function ensureDataDir() {
  const dataDir = path.dirname(POSTS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export function loadPosts(): any[] {
  try {
    ensureDataDir();
    if (fs.existsSync(POSTS_FILE)) {
      const data = fs.readFileSync(POSTS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch {
    return [];
  }
}

export function savePosts(posts: any[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error('Error saving posts:', error);
  }
}

export function addPost(post: any) {
  const posts = loadPosts();
  posts.push(post);
  savePosts(posts);
}

export function removePost(postId: string) {
  const posts = loadPosts();
  const index = posts.findIndex(post => post.id === postId);
  if (index > -1) {
    posts.splice(index, 1);
    savePosts(posts);
    return true;
  }
  return false;
}