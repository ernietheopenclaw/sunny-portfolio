export interface Concept {
  id: string;
  name: string;
  short_summary: string;
  long_summary: string;
  x: number;
  y: number;
  z: number;
  date_learned: string;
  user_id?: string;
  isFiller?: boolean;
  embedding?: number[];
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  link?: string;
  github?: string;
  image?: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: string;
}
