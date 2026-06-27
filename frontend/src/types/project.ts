export interface Project {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  category: string;
  client: string;
  budget: string;
  timeline: string;
  tags: string[];
  thumbnail: string;
  gallery: string[];
  liveUrl?: string;
  githubUrl?: string;
}
