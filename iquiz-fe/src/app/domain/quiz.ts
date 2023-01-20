import { Model } from './model';
import {User} from "./user";

export interface Quiz extends Model {

  user: User;
  title: string;
  description: string;
  bannerFile: string;
  isActive: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  questionCount: number;
  isFavorite: boolean;
}
