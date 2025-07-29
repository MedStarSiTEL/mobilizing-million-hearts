import React from 'react';
import { Oval } from 'react-loader-spinner';

export default function Loader({ active, children }) {
	return (
		<div style={{ position: 'relative' }}>
			{children}
			{active && (
				<div 
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: 'rgba(142, 142, 142, 0.49)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						zIndex: 1000
					}}
				>
					<Oval
						height={60}
						width={60}
						color="#007bff"
						wrapperStyle={{}}
						wrapperClass=""
						visible={true}
						ariaLabel='oval-loading'
						secondaryColor="#0056b3"
						strokeWidth={2}
						strokeWidthSecondary={2}
					/>
				</div>
			)}
		</div>
	);
}
