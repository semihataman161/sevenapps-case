export type VideoRow = {
  id: string;
  name: string;
  description: string;
  file_name: string;
  thumbnail_name: string | null;
  duration: number;
  source_start: number;
  width: number | null;
  height: number | null;
  created_at: number;
  updated_at: number;
};
