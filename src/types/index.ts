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
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  link?: string;
  github?: string;
  image?: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: string;
}
