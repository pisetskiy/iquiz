import { Model } from './model';
import { Position } from './position';

export interface Employee extends Model {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  position: Position;
  isAdmin: boolean;
}
