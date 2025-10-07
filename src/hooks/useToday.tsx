import { getTodayLocalizedISO } from "@/util";
import { useEffect, useState } from "react";

export const useToday = () => {
  const [today, setToday] = useState(getTodayLocalizedISO());
  useEffect(() => {
    const updateIfDateChanged = () => {
      const currentDay = getTodayLocalizedISO();
      setToday(currentDay); // react will ignore if currentDay === today
    };
    const interval = setInterval(updateIfDateChanged, 60 * 1000); // check every minute
    return () => clearInterval(interval);
  }, []);
  return today;
};
