import { Observable } from 'rxjs';
import { UserSetting } from '../../shared/settings/user-setting.interface';

export class User {
  private readonly _id: string;
  private _email: string | undefined;
  private _firstName: string;
  private _lastName: string;
  private _permissions: string[] = [];

  constructor(
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    roles: string[],
    userSettings: UserSetting[]
  ) {
    this._id = id;
    this._email = email;
    this._firstName = firstName;
    this._lastName = lastName;
    this.roles = roles;
    this.userSettings = userSettings;
  }

  phoneNumber: string | null | undefined;
  dateOfBirth: string | null | undefined;
  userSettings: UserSetting[] = [];
  roles: string[] = [];

  get id() {
    return this._id;
  }

  get email() {
    return this._email;
  }

  get firstName() {
    return this.capitalize(this._firstName);
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get lastName() {
    return this.capitalize(this._lastName);
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  get initials(): string {
    return `${this._firstName[0]}${this._lastName[0]}`.toUpperCase();
  }

  get fullName(): string {
    return `${this.capitalize(this._firstName)} ${this.capitalize(
      this._lastName
    )}`;
  }

  get permissions(): string[] {
    return this._permissions;
  }

  updateEmail(newEmail: string): void {
    this._email = newEmail;
  }

  updatePermissions(permissions: string[]) {
    this._permissions = permissions;
  }

  updateUserSettings(setting: UserSetting): void {
    const exixtingSetting = this.userSettings.find(
      (s) => s.key === setting.key
    );

    if (exixtingSetting) {
      exixtingSetting.value = setting.value;
    } else {
      this.userSettings.push(setting);
    }
  }

  private capitalize(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}
