import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Stack, Typography } from '@mui/material';
import { CalendarEvent } from '../types/eventTypes';
import { v4 as uuidv4 } from 'uuid';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { EventClickArg, EventDropArg } from '@fullcalendar/core';
import CalendarForm from './CalendarForm.tsx';
import ToolbarText from './ToolbarText.tsx';
import SubToolbarText from './SubToolbarText.tsx';

type FormValues = Omit<CalendarEvent, 'id'> & { time: Date | null; endTime: Date | null; notes?: string };

const CalendarView: React.FC = () => {
	const { control, handleSubmit, reset, setValue } = useForm<FormValues>();
	const [events, setEvents] = useState<CalendarEvent[]>([]);
	const [currentTitle, setCurrentTitle] = useState<string>('');
	const [open, setOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [currentEventId, setCurrentEventId] = useState<string | null>(null);
	const [activeView, setActiveView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('dayGridMonth');
	const [isTodayActive, setIsTodayActive] = useState<boolean>(false);
	const [activeCell, setActiveCell] = useState<HTMLElement | null>(null);
	const [isEditMode, setIsEditMode] = useState(false);
	const [clickedCellPosition, setClickedCellPosition] = useState<{ top: number; left: number } | null>(null);

	const handleClose = () => {
		setOpen(false);

		if (activeCell) {
			activeCell.style.boxShadow = '';
		}

		setActiveCell(null);
		reset();
	};

	const calendarRef = useRef<FullCalendar>(null);

	const handleViewChange = (view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay') => {
		const calendarApi = calendarRef.current?.getApi();
		calendarApi?.changeView(view);
		setCurrentTitle(calendarApi?.view.title || '');
		setActiveView(view);
	};

	const handleTodayClick = () => {
		const calendarApi = calendarRef.current?.getApi();
		calendarApi?.today();
		setCurrentTitle(calendarApi?.view.title || '');
		checkIfTodayActive();
	};

	const handlePrevClick = () => {
		const calendarApi = calendarRef.current?.getApi();
		calendarApi?.prev();
		setCurrentTitle(calendarApi?.view.title || '');
		checkIfTodayActive();
	};

	const handleNextClick = () => {
		const calendarApi = calendarRef.current?.getApi();
		calendarApi?.next();
		setCurrentTitle(calendarApi?.view.title || '');
		checkIfTodayActive();
	};

	const checkIfTodayActive = () => {
		const calendarApi = calendarRef.current?.getApi();
		if (calendarApi) {
			const today = new Date();
			const start = calendarApi.view.currentStart;
			const end = calendarApi.view.currentEnd;

			setIsTodayActive(today >= start && today < end);
		}
	};

	const handleDateClick = (arg: { dateStr: string; dayEl: HTMLElement }) => {
		setValue('start', arg.dateStr);
		reset({ title: '', start: arg.dateStr, time: null, endTime: null, color: '#000' });
		setIsEditing(false);
		setIsEditMode(true); // Enable editing mode for new events

		if (activeCell) {
			activeCell.style.boxShadow = '';
		}

		arg.dayEl.style.boxShadow = '0px 3px 6px rgba(0, 0, 0, 0.2)';
		setActiveCell(arg.dayEl);

		const rect = arg.dayEl.getBoundingClientRect();
		setClickedCellPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX });

		setOpen(true);
	};

	const handleEventClick = (arg: EventClickArg) => {
		const event = events.find(event => event.id === arg.event.id);
		if (event) {
			const startTime = dayjs(event.start).toDate();
			const endTime = event.end ? dayjs(event.end).toDate() : dayjs(event.start).add(1, 'hour').toDate();

			setValue('title', event.title);
			setValue('start', event.start.split('T')[0]);
			setValue('time', startTime);
			setValue('endTime', endTime);
			setValue('color', event.color);
			setValue('notes', event.notes || '');
			setCurrentEventId(event.id);
			setIsEditing(true);
			setIsEditMode(false);
			setOpen(true);
		}
	};

	const handleEventSave = (data: FormValues) => {
		if (!data.start || !data.time) {
			console.error('Invalid date or time');
			return;
		}

		const startDatePart = dayjs(data.start).format('YYYY-MM-DD');
		const timePart = dayjs(data.time).format('HH:mm');
		const startDateTime = dayjs(`${startDatePart}T${timePart}`).toISOString();

		const endDateTime = data.endTime
			? dayjs(`${startDatePart}T${dayjs(data.endTime).format('HH:mm')}`).toISOString()
			: undefined;

		if (isEditing && currentEventId) {
			setEvents(prevEvents =>
				prevEvents.map(event =>
					event.id === currentEventId
						? {
								...event,
								title: data.title,
								start: startDateTime,
								end: endDateTime,
								color: data.color,
								notes: data.notes,
						  }
						: event,
				),
			);
		} else {
			const newEvent: CalendarEvent = {
				id: uuidv4(),
				title: data.title,
				start: startDateTime,
				end: endDateTime,
				color: data.color,
				notes: data.notes,
			};
			setEvents(prevEvents => [...prevEvents, newEvent]);
		}

		handleClose();
		reset();
	};

	const handleEventDiscard = () => {
		if (currentEventId) {
			setEvents(events.filter(event => event.id !== currentEventId));
		}
		handleClose();
		reset();
	};

	const handleEventDrop = (arg: EventDropArg) => {
		const { event } = arg;
		setEvents(
			events.map(e =>
				e.id === event.id
					? { ...e, start: event.start?.toISOString() || e.start, end: event.end?.toISOString() || e.end }
					: e,
			),
		);
	};

	const handleEditClick = () => {
		setIsEditMode(true); // Enable editing mode
	};

	const handleTimeChange = (time: Date | null) => {
		setValue('time', time);
		if (time) {
			const endTime = dayjs(time).add(1, 'hour').toDate();
			setValue('endTime', endTime);
		}
	};

	const handleDatesSet = () => {
		const calendarApi = calendarRef.current?.getApi();
		setCurrentTitle(calendarApi?.view.title || '');
		checkIfTodayActive();
	};

	useEffect(() => {
		handleDatesSet();
	}, []);

	const renderEventContent = (eventInfo: any) => {
		return (
			<Stack
				style={{
					backgroundColor: eventInfo.event.backgroundColor,
					color: '#fff',
					padding: '7px 14px',
					borderRadius: '4px',
					width: '100%',
				}}
			>
				<Typography sx={{ fontSize: '13px', lineHeight: '17px' }}>{eventInfo.event.title}</Typography>
			</Stack>
		);
	};

	return (
		<Box display="flex" flexDirection="column" height="100vh" sx={{ m: 2 }}>
			<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
				<ToolbarText activeView={activeView} handleViewChange={handleViewChange} />
				<SubToolbarText
					currentTitle={currentTitle}
					isTodayActive={isTodayActive}
					handleTodayClick={handleTodayClick}
					handlePrevClick={handlePrevClick}
					handleNextClick={handleNextClick}
				/>
			</Box>

			<FullCalendar
				ref={calendarRef}
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				initialView="dayGridMonth"
				events={events}
				dateClick={handleDateClick}
				eventClick={handleEventClick}
				eventDrop={handleEventDrop}
				editable={true}
				droppable={true}
				nowIndicator={true}
				headerToolbar={false}
				slotLabelInterval="02:00"
				eventContent={renderEventContent}
			/>

			<CalendarForm
				open={open}
				handleClose={handleClose}
				handleSubmit={handleSubmit}
				isEditMode={isEditMode}
				isEditing={isEditing}
				handleEventSave={handleEventSave}
				handleEventDiscard={handleEventDiscard}
				handleEditClick={handleEditClick}
				setValue={setValue}
				control={control}
				handleTimeChange={handleTimeChange}
				clickedCellPosition={clickedCellPosition}
			/>
		</Box>
	);
};

export default CalendarView;
