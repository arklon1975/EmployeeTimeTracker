import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface UseCurrentTimeResult {
  currentTime: string;
  currentDate: Date;
  currentDateStr: string;
}

export default function useCurrentTime(): UseCurrentTimeResult {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const currentTime = format(currentDate, "HH:mm:ss", { locale: es });
  
  // Format the date in Spanish (e.g., "Lunes, 5 de junio, 2023")
  const currentDateStr = capitalizeFirstLetter(
    format(currentDate, "EEEE, d 'de' MMMM, yyyy", { locale: es })
  );
  
  return { currentTime, currentDate, currentDateStr };
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
