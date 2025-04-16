import { WorkingDay } from './WorkingDay';

export interface WorkingDayFieldProps {
  index: number;
  workingDay: WorkingDay;
  handleUpdateUserWorkingDays: (value: WorkingDay) => void;
  handleDeleteWorkingDay: (id: number) => void;
}
