import React, { useState, useCallback } from 'react';
import Slider from 'rc-slider';

import Handle from '../Handle/Handle.jsx';

export default function SliderFormElement({ value, min, max, name, notFound, outOfRange, cb, audit }) {
	const [submitting, setSubmitting] = useState(false);

	const handleSliderChange = useCallback((val) => {
		cb(val);
	}, [cb]);

	const callback = useCallback((newVal) => {
		if (!submitting) {
			setSubmitting(true);
			setTimeout(() => {
				audit({ subName: name, content: `${value}` });
				setSubmitting(false);
			}, 2000);
		}
		return cb(newVal);
	}, [submitting, audit, name, value, cb]);

	const handleChange = useCallback((e) => {
		const re = /^[0-9\b]+$/;
		// if value is not blank, then test the regex
		if (e.target.value === '' || re.test(e.target.value)) {
			const toInt = parseInt(e.target.value, 10);
			callback(e.target.value === '' ? '' : toInt);
		}
	}, [callback]);

	const auditHandler = useCallback((e) => {
		return audit({ subName: name, content: `${e}` });
	}, [audit, name]);

	const outOfRangeOrNotFound = value < min || value > max || !value;
	const borderColor = outOfRangeOrNotFound ? 'red' : 'black';

	const focusStyle = {
		borderColor: `1px solid ${borderColor}`,
		boxShadow: `0 0 3px ${borderColor} !important`,
		mozBoxShadow: `0 0 3px ${borderColor} !important`,
		webkitBoxShadow: `0 0 3px ${borderColor} !important`,
	};

	return (
		<div className="col-md-6 pt-0 pb-0 pl-3 pr-3">
			<div className="row mt-3 mb-2">
				<div className="col-md-12">
					<div className="row">
						<div className="col-md-8 " style={{ fontWeight: 'bold', fontSize: '14px' }}>
							<p className="ml-2">
								{name}
								<div
									style={{
										fontSize: '10px',
										color: 'red',
										visibility: outOfRangeOrNotFound ? 'visible' : 'hidden',
									}}
								>
									{!value ? notFound : outOfRange}
								</div>
							</p>
						</div>
						<div className="col-md-4">
							<div style={{ textAlign: 'right' }}>
								<textarea
									type="number"
									style={{
										textAlign: 'center',
										fontSize: '14px',
										overflow: 'hidden',
										resize: 'none',
										...focusStyle,
									}}
									value={value}
									onInput={handleChange}
									rows="1"
									cols="4"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="col-md-12 mb-2">
				<Slider
					marks={{ [min]: min, [max]: max }}
					min={min}
					max={max}
					defaultValue={value}
					value={value}
					handle={Handle}
					onChange={handleSliderChange}
					onAfterChange={auditHandler}
				/>
			</div>
		</div>
	);
}