import { UserSetting } from '../../shared/settings/user-setting.interface';
import { BasicUserInfo } from './basic-user-info.interface';

export interface LoginResponse {
  user: BasicUserInfo;
  accessToken: string;
  refreshToken: string;
  roles: string[];
  userSettings: UserSetting[];
}
