import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function delay(ms: number, enabled = true) {
  return enabled ? new Promise(resolve => setTimeout(resolve, ms)) : Promise.resolve();
}
