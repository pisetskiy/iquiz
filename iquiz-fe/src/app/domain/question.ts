import { Model } from './model';
import { Variant } from './variant';

export interface Question extends Model {
  quizId: number;
  content: string;
  type: string;
  isActive: boolean;
  variants: Variant[];
}
