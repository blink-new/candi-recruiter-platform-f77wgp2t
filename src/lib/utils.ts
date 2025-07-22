import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import blink from '@/blink/client';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const logKpiEvent = async (eventType: string, details: any) => {
  const user = await blink.auth.me();
  if (!user) return;

  await blink.db.kpi_events.create({
    id: `evt-${Date.now()}`,
    userId: user.id,
    eventType,
    details: JSON.stringify(details),
  });
};