export interface DataFieldProps {
  label: string;
  value: string | number;
  type?: string;
  dataKey: string;
  handleUpdateField: (value: { [key: string]: string | number }) => void;
}
