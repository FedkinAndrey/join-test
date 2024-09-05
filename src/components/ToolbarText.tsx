import React from 'react';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';

interface ToolbarTextProps {
	activeView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
	handleViewChange: (view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay') => void;
}

const ToolbarText: React.FC<ToolbarTextProps> = ({ activeView, handleViewChange }) => {
	return (
		<Box display="flex" justifyContent="space-between" alignItems="center" p={1} width="100%">
			<Typography variant="h6">Calendar View</Typography>
			<ButtonGroup variant="outlined" className="custom-button-group">
				<Button
					onClick={() => handleViewChange('dayGridMonth')}
					style={{
						color: activeView === 'dayGridMonth' ? '#3B86FF' : '#4D4F5C',
					}}
				>
					Month
				</Button>
				<Button
					onClick={() => handleViewChange('timeGridWeek')}
					style={{
						color: activeView === 'timeGridWeek' ? '#3B86FF' : '#4D4F5C',
					}}
				>
					Week
				</Button>
				<Button
					onClick={() => handleViewChange('timeGridDay')}
					style={{
						color: activeView === 'timeGridDay' ? '#3B86FF' : '#4D4F5C',
					}}
				>
					Day
				</Button>
			</ButtonGroup>
		</Box>
	);
};

export default ToolbarText;
