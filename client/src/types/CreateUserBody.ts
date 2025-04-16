import { SignUpFields } from './SignUpFields';
import { WorkingDay } from './WorkingDay';

export interface CreateUserBody {
  fieldsValues: SignUpFields;
  workingDays: WorkingDay[];
}
