import { CreateUserBody } from '../types/CreateUserBody';
import { WorkingDay } from '../types/WorkingDay';
import { fetchDelete, fetchGet, fetchPost, fetchPut } from './index';

export const createUser = async (body: CreateUserBody) => {
  return await fetchPost(`/users`, body);
};

export const loginUser = async (body: { email: string; isClient: boolean }) => {
  return await fetchPost(`/users/login`, body);
};

export const verifyCode = async (body: {
  email: string;
  code: string;
  isClient: boolean;
}) => {
  return await fetchPost(`/users/verify-code`, body);
};

export const getUserPersonalData = async (id: number) => {
  return await fetchGet(`/users/get-user-personal-data?id=${id}`);
};

export const getUserWorkingDays = async (id: number) => {
  return await fetchGet(`/users/get-working-days?id=${id}`);
};

export const updateUserDataById = async (body: {
  [key: string]: string | number;
}) => {
  return await fetchPut(`/users/update-user-data`, body);
};

export const updateUserWorkingDays = async (body: WorkingDay) => {
  return await fetchPut(`/users/update-user-working-days`, body);
};

export const deleteUserWorkingDay = async (id: number) => {
  return await fetchDelete(`/users/delete-user-working-day?id=${id}`);
};

export const addUserWorkingDay = async (body: { [key: string]: string }) => {
  return await fetchPost(`/users/add-user-working-day`, body);
};
