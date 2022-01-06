import { Employee } from './employee';
import { Quiz } from './quiz';
import { Model } from './model';
import { Question } from './question';
import { Answer } from './answer';

export interface Appointment extends Model {
  employee?: Employee;
  quiz?: Quiz;
  questions?: Question[];
  answers?: Answer[];
  state?: string;
  deadline?: string;
  startDate?: string;
  endDate?: string;
  answersCount?: number;
  trueAnswersCount?: number;
}
