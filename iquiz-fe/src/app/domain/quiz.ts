import { Model } from './model';

export interface Quiz extends Model {
  title: string;
  timeLimit: number;
  questions: [];
}
