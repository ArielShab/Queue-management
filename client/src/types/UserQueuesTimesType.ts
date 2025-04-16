export interface UserQueuesTimesType {
  queryKey: [
    string,
    {
      providerId: string | undefined;
      selectedDayName: string;
      selectedDate: string;
    },
  ];
}
