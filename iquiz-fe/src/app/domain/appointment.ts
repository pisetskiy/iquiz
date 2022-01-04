import { Employee } from './employee';
import { Quiz } from './quiz';
import { Model } from './model';

export interface Appointment extends Model {
  employee?: Employee;
  quiz?: Quiz;
  state?: string;
  deadline?: string;
  startDate?: string;
  endDate?: string;
}
