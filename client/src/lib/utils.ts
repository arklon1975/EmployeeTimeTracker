import { format, formatDistance, formatRelative, parse } from "date-fns";
import { es } from "date-fns/locale";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "--:--";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "hh:mm a");
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "EEEE, d 'de' MMMM, yyyy", { locale: es });
}

export function formatTimeDistance(date: Date | string | null | undefined): string {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true, locale: es });
}

export function secondsToHours(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  return `${hours}h ${minutes}m`;
}

export function secondsToMinutes(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "online":
      return "bg-success text-white";
    case "break":
      return "bg-warning text-white";
    case "offline":
      return "bg-neutral-light text-white";
    case "late":
      return "bg-error text-white";
    default:
      return "bg-neutral-light text-white";
  }
}

export function getStatusDot(status: string): string {
  switch (status) {
    case "online":
      return "bg-success";
    case "break":
      return "bg-warning";
    case "offline":
      return "bg-neutral-light";
    case "late":
      return "bg-error";
    default:
      return "bg-neutral-light";
  }
}

export function getActionIcon(action: string): string {
  switch (action) {
    case "clock-in":
      return "login";
    case "clock-out":
      return "logout";
    case "start-break":
      return "free_breakfast";
    case "end-break":
      return "free_breakfast";
    case "clock-in-late":
      return "error";
    default:
      return "info";
  }
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getStatusText(status: string): string {
  switch (status) {
    case "online":
      return "Online";
    case "break":
      return "Pausa";
    case "offline":
      return "Offline";
    case "late":
      return "Tarde";
    default:
      return "Desconocido";
  }
}
