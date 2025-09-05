import { User } from '@database/mysql/entities';

export type SanitizedRequestUser = Omit<
  User,
  | 'password'
  | 'projects'
  | 'hasId'
  | 'save'
  | 'remove'
  | 'softRemove'
  | 'recover'
  | 'reload'
>;
