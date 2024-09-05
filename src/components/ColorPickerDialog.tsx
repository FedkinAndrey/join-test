import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { ChromePicker } from 'react-color';

const ColorPickerDialog: React.FC<{
	open: boolean;
	onClose: () => void;
	selectedColor: string;
	onChange: (color: string) => void;
}> = ({ open, onClose, selectedColor, onChange }) => {
	const [tempColor, setTempColor] = useState(selectedColor);

	const handleColorChangeComplete = (color: any) => {
		setTempColor(color.hex);
	};

	const handleSave = () => {
		onChange(tempColor);
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Pick a Color</DialogTitle>
			<DialogContent>
				<ChromePicker color={tempColor} onChangeComplete={handleColorChangeComplete} />
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					Cancel
				</Button>
				<Button onClick={handleSave} color="primary">
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ColorPickerDialog;
