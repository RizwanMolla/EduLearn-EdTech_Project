import { todayKey } from '../../lib/format';

const mondayIndex = (date) => (date.getDay() + 6) % 7;

export const minutesThisWeek = (activity) => {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayIndex(today));
  let total = 0;
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    total += activity[todayKey(d)] || 0;
  }
  return total;
};
