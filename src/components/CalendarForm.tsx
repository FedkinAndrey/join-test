import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DatePicker from 'react-datepicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import ColorPickerDialog from './ColorPickerDialog';
import dayjs from 'dayjs';

const CalendarForm: React.FC<{
	open: boolean;
	handleClose: () => void;
	handleSubmit: any;
	isEditMode: boolean;
	isEditing: boolean;
	handleEventSave: any;
	handleEventDiscard: () => void;
	handleEditClick: () => void;
	setValue: any;
	control: any;
	handleTimeChange: any;
	clickedCellPosition: { top: number; left: number } | null;
}> = ({
	open,
	handleClose,
	handleSubmit,
	isEditMode,
	isEditing,
	handleEventSave,
	handleEventDiscard,
	handleEditClick,
	control,
	setValue,
	handleTimeChange,
	clickedCellPosition,
}) => {
	const [colorPickerOpen, setColorPickerOpen] = useState(false);
	const [selectedColor, setSelectedColor] = useState('#000');

	const openColorPicker = () => setColorPickerOpen(true);
	const closeColorPicker = () => setColorPickerOpen(false);

	const handleColorChange = (color: string) => {
		setSelectedColor(color);
		setValue('color', color);
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			PaperProps={{
				style: {
					position: 'absolute',
					top: clickedCellPosition ? Math.min(clickedCellPosition.top + 50, window.innerHeight - 300) : '50%',
					left: clickedCellPosition ? clickedCellPosition.left : '50%',
					transform: clickedCellPosition ? 'translateX(-50%)' : 'translate(-50%, -50%)',
					maxHeight: '80vh',
					overflowY: 'auto',
					padding: '10px',
					display: 'flex',
					flexDirection: 'column',
				},
			}}
			BackdropProps={{
				style: {
					backgroundColor: 'transparent', // Transparent backdrop to remove dark overlay
				},
			}}
		>
			<DialogTitle>
				<IconButton
					aria-label="close"
					onClick={handleClose}
					sx={{
						position: 'absolute',
						right: 8,
						top: 8,
						color: theme => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ padding: '5px', minWidth: '200px' }}>
				<div className="modal-arrow"></div>
				<Box
					component="form"
					autoComplete="off"
					onSubmit={handleSubmit(handleEventSave)}
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
					}}
				>
					<Controller
						name="title"
						control={control}
						defaultValue=""
						rules={{
							required: 'Event name is required',
							maxLength: {
								value: 30,
								message: 'Event name cannot exceed 30 characters',
							},
						}}
						render={({ field, fieldState }) => (
							<TextField
								{...field}
								autoFocus
								label="Event Name"
								type="text"
								fullWidth
								disabled={!isEditMode}
								variant="standard"
								error={!!fieldState.error}
								helperText={fieldState.error ? fieldState.error.message : ''}
							/>
						)}
					/>
					<Controller
						name="start"
						control={control}
						defaultValue={new Date().toDateString()}
						rules={{
							required: 'Event name is required',
						}}
						render={({ field, fieldState }) => (
							<DatePicker
								selected={field.value ? new Date(field.value) : null}
								onChange={date => field.onChange(date)}
								dateFormat="yyyy-MM-dd"
								disabled={!isEditMode}
								customInput={
									<TextField
										{...field}
										label="Event Date"
										fullWidth
										variant="standard"
										slotProps={{
											input: { disabled: !isEditMode },
										}}
										error={!!fieldState.error}
										helperText={fieldState.error ? fieldState.error.message : ''}
									/>
								}
							/>
						)}
					/>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<Controller
							name="time"
							control={control}
							defaultValue={null}
							rules={{ required: true }}
							render={({ field, fieldState }) => (
								<TimePicker
									label="Event Time"
									value={field.value ? dayjs(field.value) : null}
									disabled={!isEditMode}
									onChange={newTime => handleTimeChange(newTime?.toDate() || null)}
									slotProps={{
										textField: {
											fullWidth: true,
											required: true,
											variant: 'standard',
											disabled: !isEditMode,
											style: { paddingRight: '12px' },
											error: !!fieldState.error,
										},
									}}
								/>
							)}
						/>
					</LocalizationProvider>
					<Button
						onClick={openColorPicker}
						style={{ backgroundColor: selectedColor, color: '#fff', marginBottom: '1rem' }}
					>
						Choose Color
					</Button>
					<Controller
						name="notes"
						control={control}
						defaultValue=""
						render={({ field }) => (
							<TextField {...field} label="Notes" type="text" fullWidth disabled={!isEditMode} variant="standard" />
						)}
					/>
					<DialogActions>
						{isEditing && !isEditMode ? (
							<>
								<Button onClick={handleEventDiscard} style={{ color: 'red' }}>
									Discard
								</Button>
								<Button onClick={handleEditClick} style={{ color: 'blue' }}>
									Edit
								</Button>
							</>
						) : (
							<Button type="submit" style={{ color: 'blue' }}>
								Save
							</Button>
						)}
					</DialogActions>
				</Box>
			</DialogContent>

			<ColorPickerDialog
				open={colorPickerOpen}
				onClose={closeColorPicker}
				selectedColor={selectedColor}
				onChange={handleColorChange}
			/>
		</Dialog>
	);
};

export default CalendarForm;
