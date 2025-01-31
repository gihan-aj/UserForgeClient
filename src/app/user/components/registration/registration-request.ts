export interface RegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null | undefined;
  dateOfBirth: string | null | undefined;
  password: string;
}
