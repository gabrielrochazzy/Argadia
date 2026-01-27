export interface Species {
  id: string;
  name: string;
  description: string;
  photoUrl: string;
  createdAt: number;
}

export type ViewMode = 'list' | 'create';
