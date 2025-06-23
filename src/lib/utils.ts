import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { date } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: any) => {
  return new Intl.DateTimeFormat('en-CA').format(new Date(date));
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
