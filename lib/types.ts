export type Area = 'personal' | 'amigos' | 'familia' | 'pareja';
export type ListedArea = Exclude<Area, 'personal'>;

export interface Plan {
  id: string;
  area: Area;
  title: string;
  note: string | null;
  created_at: string;
}
