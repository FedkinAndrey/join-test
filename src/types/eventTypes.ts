export interface CalendarEvent {
	id: string;
	title: string;
	start: string; // ISO string with date and time
	end?: string; // ISO string with date and time
	color: string;
	notes?: string;
}
