import { CalendarEvent } from '../types/eventTypes.ts';
import { CalendarActiveView } from '../types/types.ts';

export const getStoredEvents = (): CalendarEvent[] => {
	const storedEvents = localStorage.getItem('calendarEvents');
	return storedEvents ? JSON.parse(storedEvents) : [];
};

export const getStoredView = (): CalendarActiveView => {
	const storedView = localStorage.getItem('calendarView');
	return (storedView as CalendarActiveView) || 'dayGridMonth';
};
