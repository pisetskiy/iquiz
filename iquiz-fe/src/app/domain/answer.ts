import { Model } from './model';

export interface Answer extends Model {
  gameId: number;
  questionId: number;
  participantId: number;
  variantId: number;
  isTrue: boolean;
}
