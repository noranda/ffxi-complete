import type {IconCategory} from '@/icons/types';

export type IconEntry = {
  category: IconCategory;
  description: string;
  id: number;
  name: string;
  tags?: string[];
};
