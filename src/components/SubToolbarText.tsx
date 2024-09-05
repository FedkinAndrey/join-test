import React from 'react';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';

interface SubToolbarTextProps {
	currentTitle: string;
	isTodayActive: boolean;
	handleTodayClick: () => void;
	handlePrevClick: () => void;
	handleNextClick: () => void;
}

const SubToolbarText: React.FC<SubToolbarTextProps> = ({
	currentTitle,
	isTodayActive,
	handleTodayClick,
	handlePrevClick,
	handleNextClick,
}) => {
	return (
		<Box display="flex" justifyContent="space-between" alignItems="center" p={1} width="100%">
			<ButtonGroup variant="outlined" className="custom-button-group">
				<Button
					onClick={handleTodayClick}
					style={{
						color: isTodayActive ? '#3B86FF' : '#4D4F5C',
					}}
				>
					Today
				</Button>
				<Button onClick={handlePrevClick}>Back</Button>
				<Button onClick={handleNextClick}>Next</Button>
			</ButtonGroup>
			<Typography variant="h6">{currentTitle}</Typography>
		</Box>
	);
};

export default SubToolbarText;
