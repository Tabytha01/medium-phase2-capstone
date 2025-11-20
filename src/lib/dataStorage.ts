import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json');
const REACTIONS_FILE = path.join(DATA_DIR, 'reactions.json');
const FOLLOWS_FILE = path.join(DATA_DIR, 'follows.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Comments
export function loadComments(): any[] {
  try {
    ensureDataDir();
    if (fs.existsSync(COMMENTS_FILE)) {
      return JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf8'));
    }
    return [];
  } catch {
    return [];
  }
}

export function saveComments(comments: any[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
  } catch (error) {
    console.error('Error saving comments:', error);
  }
}

// Reactions
export function loadReactions(): any[] {
  try {
    ensureDataDir();
    if (fs.existsSync(REACTIONS_FILE)) {
      return JSON.parse(fs.readFileSync(REACTIONS_FILE, 'utf8'));
    }
    return [];
  } catch {
    return [];
  }
}

export function saveReactions(reactions: any[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(REACTIONS_FILE, JSON.stringify(reactions, null, 2));
  } catch (error) {
    console.error('Error saving reactions:', error);
  }
}

// Follows
export function loadFollows(): any[] {
  try {
    ensureDataDir();
    if (fs.existsSync(FOLLOWS_FILE)) {
      return JSON.parse(fs.readFileSync(FOLLOWS_FILE, 'utf8'));
    }
    return [];
  } catch {
    return [];
  }
}

export function saveFollows(follows: any[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(FOLLOWS_FILE, JSON.stringify(follows, null, 2));
  } catch (error) {
    console.error('Error saving follows:', error);
  }
}