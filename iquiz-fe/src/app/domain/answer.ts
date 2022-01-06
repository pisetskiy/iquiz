import { Model } from './model';

export interface Answer extends Model {
  question: number;
  variants: number[];
  isTrue: boolean;
}
