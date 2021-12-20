import { Model } from './model';
import { Variant } from './variant';

export interface Question extends Model {
  content: string;
  type: string;
  variants: Variant[];
}
