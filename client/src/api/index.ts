import { AxiosError } from 'axios';
import axiosInstance from './axiosInstance';

export const fetchGet = async <T>(url: string): Promise<T | any> => {
  try {
    const { data } = await axiosInstance.get<T>(url);
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    const axiosError = error as AxiosError;
    return axiosError.response?.data;
  }
};

export const fetchPost = async <T, U>(
  url: string,
  body: U,
): Promise<T | any> => {
  try {
    const { data } = await axiosInstance.post<T>(url, body);
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    const axiosError = error as AxiosError;
    return axiosError.response?.data;
  }
};

export const fetchPut = async <T, U>(
  url: string,
  body: U,
): Promise<T | any> => {
  try {
    const { data } = await axiosInstance.put<T>(url, body);
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    const axiosError = error as AxiosError;
    return axiosError.response?.data;
  }
};

export const fetchDelete = async <T>(url: string): Promise<T | any> => {
  try {
    const { data } = await axiosInstance.delete<T>(url);
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    const axiosError = error as AxiosError;
    return axiosError.response?.data;
  }
};
