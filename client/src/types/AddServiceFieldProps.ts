export interface AddServiceFieldProps {
  setIsAddService: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddService: (serviceName: string) => void;
}
