import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchBlob(url: string, options?: RequestInit) {
  const response = await fetch(url, options);
  return await response.blob();
}

export const styles = {
  screen: 'flex-1 flex-col p-5',
};
