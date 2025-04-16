import { FieldsErrors } from './FieldsErrors';

export interface InputFieldProps {
  label: string;
  id: string;
  placeholder: string;
  fieldsErrors: FieldsErrors;
  value: string | number;
  handleFieldChange: (id: string, value: string) => void;
}
