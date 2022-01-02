import { Model } from './model';
import { Quiz } from './quiz';

export interface Position extends Model {
  title: string;
  quizzesCount: number;
  quizzes: Quiz[];
}
