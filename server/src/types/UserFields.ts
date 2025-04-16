export interface UserFields {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  queueDuration: number;
  verificationCode?: string;
  codeExpiration?: Date;
}
