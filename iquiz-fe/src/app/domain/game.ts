import {Model} from "./model";
import {User} from "./user";
import {Quiz} from "./quiz";
import {Participant} from "./participant";

export interface Game extends Model {
  user: User;
  quiz: Quiz;
  code: string;
  state: string;
  settings: string;
  participants: Participant[];
}
