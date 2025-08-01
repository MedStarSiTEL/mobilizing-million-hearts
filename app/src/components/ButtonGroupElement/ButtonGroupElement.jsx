import React, { useCallback } from 'react';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

export default function ButtonGroupElement({ values, selected, name, audit, cb }) {
	const callback = useCallback(async (newValue) => {
		const options = {
			subName: name,
			content: `Selected ${newValue}`,
		};
		if (selected !== newValue) {
			audit(options);
		}
		return cb(newValue);
	}, [name, audit, cb, selected]);

	const buttons = values.map((ele) => {
		const onClick = (e) => {
			const newValue = e.target.value;
			callback(newValue);
		};

		return (
			<ToggleButton key={ele} onChange={onClick} value={ele} type="button" className="btn btn-secondary">
				{ele}
			</ToggleButton>
		);
	});

	return (
		<div className="col-md-4">
			<p className="mb-1" style={{ fontWeight: 'bold', fontSize: '14px' }}>
				{name}
			</p>
			<ToggleButtonGroup style={{ fontSize: '14px' }} type="checkbox" size="sm" value={selected}>
				{buttons}
			</ToggleButtonGroup>
		</div>
	);
}