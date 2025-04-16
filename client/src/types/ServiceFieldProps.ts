export interface ServiceFieldProps {
  serviceId: number;
  serviceName: string;
  index: number;
  handleUpadteService: (serviceId: number, serviceName: string) => void;
  handleDeleteService: (serviceId: number) => void;
}
