import {Model} from "./model";

export interface User extends Model {
  username: string;
  email: string;
  isActive: boolean;
  role: string;
}
